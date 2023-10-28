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
  Rating,
  Center,
} from "@mantine/core";
import { useToggle, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconMail,
  IconMapPin,
  IconPhone,
  IconCheck,
  IconX,
  IconClock,
  IconPaw,
} from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  AccountStatusEnum,
  ServiceListing,
  getErrorMessageProps,
} from "shared-utils";
import { formatNumber2Decimals } from "shared-utils";
import { PageTitle } from "web-ui";
import NumberInputWithIcons from "web-ui/shared/NumberInputWithIcons";
import SimpleOutlineButton from "web-ui/shared/SimpleOutlineButton";
import api from "@/api/axiosConfig";
import SelectTimeslotModal from "@/components/appointment-booking/SelectTimeslotModal";
import ImageCarousel from "@/components/common/file/ImageCarousel";
import FavouriteButton from "@/components/favourites/FavouriteButton";
import StarRating from "@/components/review/StarRating";
import BusinessLocationsGroup from "@/components/service-listing-discovery/BusinessLocationsGroup";
import DescriptionAccordionItem from "@/components/service-listing-discovery/DescriptionAccordionItem";
import InactiveServiceListingMessage from "@/components/service-listing-discovery/InactiveServiceListingMessage";
import ReviewAccordionItem from "@/components/service-listing-discovery/ReviewAccordionItem";
import ServiceCategoryBadge from "@/components/service-listing-discovery/ServiceCategoryBadge";
import ServiceListingBreadcrumbs from "@/components/service-listing-discovery/ServiceListingBreadcrumbs";
import ServiceListingScrollCarousel from "@/components/service-listing-discovery/ServiceListingScrollCarousel";
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
  recommendedListings: ServiceListing[];
  likedBy: number[];
  reportedBy: number[];
}

export default function ServiceListingDetails({
  userId,
  serviceListing,
  recommendedListings,
  likedBy,
  reportedBy,
}: ServiceListingDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useToggle();
  const { addItemToCart } = useCartOperations(userId);
  const { data: favouritedListings = [] } =
    useGetAllFavouriteServiceListingsByPetOwnerIdWithQueryParams(userId);
  const [isFavourite, setIsFavourite] = useState(false);
  const [value, setValue] = useState<number | "">(1);
  const [opened, { open, close }] = useDisclosure(false); // for view timeslot modal

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

  // console.log("servicelisting", serviceListing);
  // console.log("likedBy", likedBy);
  // console.log("reportedBy", reportedBy);

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
        ...getErrorMessageProps("Error Adding Listing to Favourites", error),
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
        ...getErrorMessageProps(
          "Error Removing Listing from Favourites",
          error,
        ),
      });
    }
  };

  const handleFavouriteToggle = async () => {
    const session = await getSession();
    if (!session) {
      notifications.show({
        title: "Login Required",
        message: "Please log in to add to favourites!",
        color: "red",
      });
      return;
    }
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

  // prevent user from viewing service listing details if pet business is inactive
  if (
    serviceListing.petBusiness.user.accountStatus !== AccountStatusEnum.Active
  ) {
    return <InactiveServiceListingMessage />;
  }

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
                onClick={async () => handleFavouriteToggle()}
              />
            </Group>

            <Box display="flex" mt={-10} mb={10}>
              <Text mr={5} fw={500} size="md">
                {serviceListing.overallRating === 0
                  ? "Not rated yet"
                  : `${serviceListing.overallRating.toFixed(1)}/5 (${
                      serviceListing.reviews.length
                    } reviews)`}
              </Text>
              <StarRating
                value={serviceListing.overallRating}
                viewOnly
                allowFractions
              />
            </Box>
            <ServiceListingTags tags={serviceListing.tags} size="md" mb="xl" />
            <ImageCarousel
              attachmentURLs={serviceListing.attachmentURLs}
              altText="Service Listing Photo"
              imageHeight={500}
            />
            <Accordion
              radius="md"
              variant="filled"
              mt="xl"
              mb={
                !recommendedListings || recommendedListings?.length === 0
                  ? 80
                  : 0
              }
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
              <ReviewAccordionItem
                title={
                  serviceListing.reviews.length === 0
                    ? "Reviews (no reviews yet)"
                    : `Reviews (${serviceListing.reviews.length})`
                }
                serviceListing={serviceListing}
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
                <SelectTimeslotModal
                  orderItem={null}
                  petOwnerId={userId}
                  serviceListing={serviceListing}
                  opened={opened}
                  onClose={close}
                  viewOnly
                />
              </Paper>
            )}
          </Grid.Col>
          <Grid.Col span={12}>
            <ServiceListingScrollCarousel
              serviceListings={recommendedListings}
              title="Recommended for you"
              description="Based on your pets, order history and what's popular"
            />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;
  const serviceListing = (await (
    await api.get(`/service-listings/${id}`)
  ).data) as ServiceListing;

  let likedBy = [];
  let reportedBy = [];

  try {
    const data = await (await api.get(`/reviews/liked-reported/${id}`)).data;
    likedBy = data.likedBy;
    reportedBy = data.reportedBy;
  } catch (e) {
    console.log(e);
  }

  const session = await getSession(context);

  if (!session) return { props: { serviceListing } };
  const userId = session.user["userId"];

  const recommendedData = (await (
    await api.get(`/service-listings/get-recommended-listings/${userId}`)
  ).data) as ServiceListing[];
  const recommendedListings = recommendedData.filter(
    (listing) => serviceListing.serviceListingId !== listing.serviceListingId,
  );

  return {
    props: { userId, serviceListing, recommendedListings, likedBy, reportedBy },
  };
}
