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
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconMail,
  IconMapPin,
  IconPhone,
  IconHeart,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useState } from "react";
import { ServiceListing } from "shared-utils";
import { PageTitle } from "web-ui";
import SimpleOutlineButton from "web-ui/shared/SimpleOutlineButton";
import api from "@/api/axiosConfig";
import BusinessLocationsGroup from "@/components/service-listing-discovery/BusinessLocationsGroup";
import DescriptionAccordionItem from "@/components/service-listing-discovery/DescriptionAccordionItem";
import ServiceCategoryBadge from "@/components/service-listing-discovery/ServiceCategoryBadge";
import ServiceListingBreadcrumbs from "@/components/service-listing-discovery/ServiceListingBreadcrumbs";
import ServiceListingCarousel from "@/components/service-listing-discovery/ServiceListingCarousel";
import ServiceListingTags from "@/components/service-listing-discovery/ServiceListingTags";
import {
  useAddServiceListingToFavourites,
  useRemoveServiceListingFromFavourites,
} from "@/hooks/pet-owner";
import { AddRemoveFavouriteServiceListingPayload } from "@/types/types";
import { formatPriceForDisplay } from "@/util";

interface ServiceListingDetailsProps {
  serviceListing: ServiceListing;
  userId: number;
}

export default function ServiceListingDetails({
  serviceListing,
  userId,
}: ServiceListingDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useToggle();
  const [isFavourite, setIsFavourite] = useState(
    serviceListing.favouritedUsers
      ? serviceListing.favouritedUsers.some((user) => user.userId === userId)
      : false,
  );

  console.log(isFavourite + " on start");
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
      console.log(isFavourite + " on add");
      notifications.show({
        title: "Favourite Added",
        color: "green",
        icon: <IconCheck />,
        message: `Listing ${payload.serviceListingId} added to favourites.`,
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
      console.log(isFavourite + " on remove");
      notifications.show({
        title: "Favourite Removed",
        color: "green",
        icon: <IconCheck />,
        message: `Listing ${payload.serviceListingId} removed from favourites.`,
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
            <Button
              onClick={handleFavouriteToggle}
              variant={"subtle"}
              color={isFavourite ? null : "gray"}
              leftIcon={
                <IconHeart size={20} fill={isFavourite ? "red" : "none"} />
              }
            >
              Favourite
            </Button>
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
            <Button size="md" fullWidth mt="xs" onClick={handleClickBuyNow}>
              Buy now
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;

  const session = await getSession(context);
  if (!session) return { props: {} };
  const userId = session.user["userId"];
  const serviceListing = await (await api.get(`/service-listings/${id}`)).data;
  return { props: { serviceListing, userId } };
}
