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
} from "@mantine/core";
import { useToggle, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconMail,
  IconMapPin,
  IconPhone,
  IconCheck,
  IconX,
  IconClock12,
  IconClock,
} from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { ServiceListing } from "shared-utils";
import { formatNumber2Decimals } from "shared-utils";
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
  const { addItemToCart } = useCartOperations(userId);
  const { data: favouritedListings = [] } =
    useGetAllFavouriteServiceListingsByPetOwnerIdWithQueryParams(userId);
  const [isFavourite, setIsFavourite] = useState(false);
  const [value, setValue] = useState<number | "">(1);
  const [opened, { open, close }] = useDisclosure(false); // for select timeslot modal

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

  const ACCORDION_VALUES = ["description", "business"];

  const serviceListingId = serviceListing.serviceListingId;
  const payload: AddRemoveFavouriteServiceListingPayload = {
    userId,
    serviceListingId,
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

  const handleClickAddToCart = async () => {
    const session = await getSession();
    if (!session) {
      notifications.show({
        title: "Login Required",
        message: "Please log in to add to cart!",
        color: "red",
      });
      return;
    }

    try {
      await addItemToCart(
        {
          serviceListing: serviceListing,
          ...{ quantity: value },
          isSelected: true,
        } as CartItem,
        Number(value),
      );
      notifications.show({
        title: "Added to cart",
        message: `${Number(value) > 1 ? `${value}` : ""} '${
          serviceListing.title
        }' added to cart.`,
        color: "green",
      });
      setValue(1);
    } catch (error) {
      notifications.show({
        title: "Error Adding to Cart",
        message: "Please try again later.",
        color: "red",
      });
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
        {serviceListing.addresses.length > 0 && (
          <BusinessLocationsGroup addresses={serviceListing.addresses} />
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );

  return (
    <div>
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
              sx={{ position: "relative" }}
            >
              <Text size="xl" weight={500} mb="md">
                ${formatNumber2Decimals(serviceListing.basePrice)}
              </Text>

              <NumberInputWithIcons
                min={1}
                max={10}
                step={1}
                value={value}
                setValue={setValue}
                fullWidth
              />

              <Button
                size="md"
                fullWidth
                mt="xs"
                onClick={handleClickAddToCart}
                color="dark"
                className="gradient-hover"
              >
                Add to cart
              </Button>
            </Paper>

            {serviceListing.requiresBooking && (
              <Paper
                radius="md"
                bg={theme.colors.gray[0]}
                p="lg"
                withBorder
                mt="xs"
                sx={{ position: "relative" }}
              >
                <Group mb="xs">
                  <IconClock color={theme.colors.indigo[5]} />
                  <Text fw={600} size="lg" ml={-5}>
                    Available timeslots
                  </Text>
                </Group>
                <Text color="dimmed" size="sm">
                  This service listing requires appointment booking. View
                  available timeslots before making your purchase!
                </Text>
                <Button
                  size="md"
                  fullWidth
                  mt="md"
                  onClick={open}
                  variant="light"
                  sx={{ border: "1.5px solid" }}
                >
                  View timeslots
                </Button>
              </Paper>
            )}
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
