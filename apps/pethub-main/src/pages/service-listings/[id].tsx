import {
  Container,
  Text,
  Button,
  Group,
  Grid,
  Accordion,
  Paper,
  useMantineTheme,
  Box,
  Stack,
  Center,
  Flex,
} from "@mantine/core";
import { useToggle, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconMail,
  IconMapPin,
  IconPhone,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { ServiceListing } from "shared-utils";
import { PageTitle } from "web-ui";
import NumberInputWithIcons from "web-ui/shared/NumberInputWithIcons";
import SimpleOutlineButton from "web-ui/shared/SimpleOutlineButton";
import api from "@/api/axiosConfig";
import SelectTimeslotModal from "@/components/appointment-booking/SelectTimeslotModal";
import FavouriteButton from "@/components/favourites/FavouriteButton";
import BusinessLocationsGroup from "@/components/service-listing-discovery/BusinessLocationsGroup";
import DescriptionAccordionItem from "@/components/service-listing-discovery/DescriptionAccordionItem";
import ServiceCategoryBadge from "@/components/service-listing-discovery/ServiceCategoryBadge";
import ServiceListingBreadcrumbs from "@/components/service-listing-discovery/ServiceListingBreadcrumbs";
import ServiceListingCarousel from "@/components/service-listing-discovery/ServiceListingCarousel";
import ServiceListingTags from "@/components/service-listing-discovery/ServiceListingTags";
import { useCartOperations } from "@/hooks/cart";
import {
  useAddServiceListingToFavourites,
  useGetAllFavouriteServiceListingsByPetOwnerIdWithQueryParams,
  useRemoveServiceListingFromFavourites,
} from "@/hooks/pet-owner";
import {
  AddRemoveFavouriteServiceListingPayload,
  CartItem,
} from "@/types/types";
import { formatPriceForDisplay } from "@/util";

interface ServiceListingDetailsProps {
  userId: number;
  serviceListing: ServiceListing;
}

export default function ServiceListingDetails({
  userId,
  serviceListing,
}: ServiceListingDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useToggle();
  const [cartItemCount, setCartItemCount] = useState(0);
  // Force the SL page to refetch new cart items from localstorage and display a text if it is added from the timeslot modal
  const [key, setKey] = useState(Math.random());
  const { addItemToCart, getCartItems, cart } = useCartOperations(userId);
  const { data: favouritedListings = [] } =
    useGetAllFavouriteServiceListingsByPetOwnerIdWithQueryParams(userId);
  const [isFavourite, setIsFavourite] = useState(false);
  const [value, setValue] = useState<number | "">(1);
  const [opened, { open, close }] = useDisclosure(false); // for select timeslot modal

  console.log("HELLO", serviceListing.calendarGroupId);

  useEffect(() => {
    if (
      favouritedListings.some(
        (listing) =>
          listing.serviceListingId === serviceListing.serviceListingId,
      )
    ) {
      setIsFavourite(true);
    } else {
      setIsFavourite(false);
    }
  }, [favouritedListings, serviceListing]);

  useEffect(() => {
    const cartItems = getCartItems();
    const itemCount = cartItems.reduce((acc, item) => {
      if (item.serviceListing.serviceListingId === serviceListingId) {
        return acc + (item.quantity || 1);
      }
      return acc;
    }, 0);
    setCartItemCount(itemCount);
  }, [key, getCartItems, cart]);

  const ACCORDION_VALUES = ["description", "business"];

  const serviceListingId = serviceListing.serviceListingId;
  const payload: AddRemoveFavouriteServiceListingPayload = {
    userId,
    serviceListingId,
  };

  // Todo: At the moment, even though the refreshing of key is causing the useEffect to setIsServiceListingInCart to run, the cart fetched WHEN ADDING FROM THE MODAL is not the updated one
  const refetchCart = () => {
    setKey(Math.random());
  };

  const addFavouriteMutation = useAddServiceListingToFavourites();
  const handleAddFavourite = async (
    payload: AddRemoveFavouriteServiceListingPayload,
  ) => {
    try {
      await addFavouriteMutation.mutateAsync(payload);
      setIsFavourite(!isFavourite);
      notifications.show({
        title: "Favourite Added",
        color: "green",
        icon: <IconCheck />,
        message: `Listing "${serviceListing.title}" added to favourites.`,
      });
    } catch (error: any) {
      notifications.show({
        title: "Error Adding Listing to Favourites",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
  };

  const removeFavouriteMutation = useRemoveServiceListingFromFavourites();
  const handleRemoveFavourite = async (
    payload: AddRemoveFavouriteServiceListingPayload,
  ) => {
    try {
      await removeFavouriteMutation.mutateAsync(payload);
      setIsFavourite(!isFavourite);
      notifications.show({
        title: "Favourite Removed",
        color: "green",
        icon: <IconCheck />,
        message: `Listing "${serviceListing.title}" removed from favourites.`,
      });
    } catch (error: any) {
      notifications.show({
        title: "Error Removing Listing from Favourites",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
  };

  const handleFavouriteToggle = () => {
    if (isFavourite) {
      handleRemoveFavourite(payload);
    } else {
      handleAddFavourite(payload);
    }
  };

  const handleClickBuyNow = async () => {
    const session = await getSession();
    if (!session) {
      notifications.show({
        title: "Login Required",
        message: "Please log in to buy!",
        color: "red",
      });
      return;
    }
    if (serviceListing.calendarGroupId) {
      open(); // Handle add to cart in the modal
    } else {
      try {
        await addItemToCart(
          {
            serviceListing: serviceListing,
          } as CartItem,
          value as number,
        );
        notifications.show({
          title: "Added to cart",
          message: `'${serviceListing.title}' added to cart.`,
          color: "green",
        });
      } catch (error) {
        notifications.show({
          title: "Error Adding to Cart",
          message: "Please try again later.",
          color: "red",
        });
      }
    }
  };

  const businessSection = (
    <Accordion.Item value="business" p="sm" mb="xl">
      <Accordion.Control
        icon={<IconMapPin color={theme.colors.indigo[5]} />}
        sx={{ "&:hover": { cursor: "default" } }}
      >
        <Text size="xl" weight={600}>
          Where to use
        </Text>
      </Accordion.Control>
      <Accordion.Panel ml={5} mr={5}>
        <Group>
          <Box>
            <Text weight={500}>{serviceListing.petBusiness.companyName}</Text>
            <Text color="dimmed" size="sm">
              UEN: {serviceListing.petBusiness.uen}
            </Text>
          </Box>
          <SimpleOutlineButton
            text="View business"
            ml={5}
            onClick={() =>
              router.push(`/pet-businesses/${serviceListing.petBusinessId}`)
            }
          />
        </Group>

        <Stack mt="lg" spacing={5}>
          <Group spacing="xs">
            <IconPhone color="gray" size="1.2rem" />
            <Text size="sm">{serviceListing.petBusiness.contactNumber}</Text>
          </Group>
          <Group spacing="xs">
            <IconMail color="gray" size="1.2rem" />
            <Text size="sm">{serviceListing.petBusiness.businessEmail}</Text>
          </Group>
        </Stack>

        {/*if there are addresses*/}
        {serviceListing.addresses.length > 0 ? (
          <BusinessLocationsGroup addresses={serviceListing.addresses} />
        ) : null}
      </Accordion.Panel>
    </Accordion.Item>
  );

  return (
    <div key={key}>
      <Head>
        <title>{serviceListing.title} - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} size="70vw" sx={{ overflow: "hidden" }}>
        <Grid gutter="xl">
          <Grid.Col span={9}>
            <ServiceListingBreadcrumbs
              title={serviceListing.title}
              id={serviceListing.serviceListingId}
            />
            <ServiceCategoryBadge
              category={serviceListing.category}
              size="lg"
              mt="xl"
              mb={5}
            />
            <Group position="apart">
              <PageTitle
                title={serviceListing.title}
                mb="xs"
                size="2.25rem"
                weight={700}
              />
              <FavouriteButton
                text={isFavourite ? "Remove Favourite" : "Favourite"}
                isFavourite={isFavourite}
                size={20}
                onClick={handleFavouriteToggle}
              />
            </Group>
            <ServiceListingTags tags={serviceListing.tags} size="md" mb="xl" />
            <ServiceListingCarousel
              attachmentURLs={serviceListing.attachmentURLs}
            />
            <Accordion
              radius="md"
              variant="filled"
              mt="xl"
              mb={80}
              multiple
              value={ACCORDION_VALUES}
              chevronSize={0}
              onChange={() => {}}
            >
              {businessSection}
              <DescriptionAccordionItem
                title="Description"
                description={serviceListing.description}
                showFullDescription={showFullDescription}
                setShowFullDescription={setShowFullDescription}
              />
            </Accordion>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper
              radius="md"
              bg={theme.colors.gray[0]}
              p="lg"
              withBorder
              mt={50}
            >
              <Group position="apart">
                <Text size="xl" weight={500}>
                  ${formatPriceForDisplay(serviceListing.basePrice)}
                </Text>
              </Group>
              {!serviceListing.calendarGroupId && (
                <Flex justify="flex-end">
                  <NumberInputWithIcons
                    min={1}
                    max={10}
                    step={1}
                    value={value}
                    setValue={setValue}
                    reduceSize
                  />
                </Flex>
              )}
              <Button size="md" fullWidth mt="xs" onClick={handleClickBuyNow}>
                Add to cart
              </Button>
              {cartItemCount !== 0 && (
                <Text size="xs" mt="xs" c="dark" align="right" fw={600}>
                  {cartItemCount} {cartItemCount === 1 ? "item" : "items"} in
                  cart
                </Text>
              )}
              <SelectTimeslotModal
                petOwnerId={userId}
                serviceListing={serviceListing}
                opened={opened}
                onClose={close}
                refresh={refetchCart}
              />
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;

  const serviceListing = await (await api.get(`/service-listings/${id}`)).data;
  const session = await getSession(context);
  if (!session) return { props: { serviceListing } };
  const userId = session.user["userId"];

  return { props: { userId, serviceListing } };
}
