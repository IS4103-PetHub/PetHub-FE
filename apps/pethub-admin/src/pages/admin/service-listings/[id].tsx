import { Carousel } from "@mantine/carousel";
import {
  Accordion,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCalendarTime,
  IconCheck,
  IconListDetails,
  IconPhotoPlus,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  downloadFile,
  extractFileName,
  formatISODateLong,
  formatISODateTimeShort,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import { PageTitle } from "web-ui";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ImageCarousel from "web-ui/shared/ImageCarousel";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
import ServiceListingReview from "@/components/service-listings/ServiceListingReview";
import {
  useDeleteServiceListingById,
  useGetServiceListingById,
} from "@/hooks/service-listing";
import { PermissionsCodeEnum } from "@/types/constants";
import { Permission } from "@/types/types";

interface ServiceListingDetailsProps {
  serviceListingId: number;
  permissions: Permission[];
}

export default function ServiceListingDetails({
  serviceListingId,
  permissions,
}: ServiceListingDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(
    PermissionsCodeEnum.WriteServiceListings,
  );
  const [imagePreview, setImagePreview] = useState([]);
  const [textExceedsLineClamp, setTextExceedsLineClamp] = useState(false);
  const textRef = useRef(null);
  const { data: serviceListing, refetch } =
    useGetServiceListingById(serviceListingId);
  const OPEN_FOREVER = ["details", "review"];
  const [showFullDescription, toggleShowFullDescription] = useToggle();

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const textHeight = textRef.current.clientHeight;
      // Check if text exceeds 2 lines
      if (textHeight > lineHeight * 2) {
        setTextExceedsLineClamp(true);
      }
    }
    const fetchAndSetServiceListingFields = async () => {
      if (serviceListing) {
        await getFilesFromServiceListing(); // Wait for setServiceListingFields to complete
      }
    };

    fetchAndSetServiceListingFields(); // Immediately invoke the async function
  }, [serviceListing]);

  const getFilesFromServiceListing = async () => {
    const fileNames = serviceListing.attachmentKeys.map((keys) =>
      extractFileName(keys),
    );

    const downloadPromises = fileNames.map((filename, index) => {
      const url = serviceListing.attachmentURLs[index];
      return downloadFile(url, filename).catch((error) => {
        console.error(`Error downloading file ${filename}:`, error);
        return null; // Return null for failed downloads
      });
    });

    const downloadedFiles: File[] = await Promise.all(downloadPromises);
    const imageUrls = downloadedFiles.map((file) => URL.createObjectURL(file));
    setImagePreview(imageUrls);
  };

  /*
   * Delete
   */
  const deleteServiceListingMutation = useDeleteServiceListingById(queryClient);
  const handleDeleteServiceListing = async (id: number) => {
    try {
      await deleteServiceListingMutation.mutateAsync(id);
      notifications.show({
        title: "Service Listing Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `Service Listing ID: ${id} deleted successfully.`,
      });
      // refetch();
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Service Listing", error),
      });
    }
  };

  const generateItemGroup = (
    title: string,
    content: ReactNode,
    colProps: any = {},
  ) => {
    return (
      <>
        <Grid.Col span={7} {...colProps}>
          <Text fw={500}>{title}</Text>
        </Grid.Col>
        <Grid.Col span={17} {...colProps}>
          {content}
        </Grid.Col>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Service Listing Details - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <LargeBackButton
        text="Back to Service Listings"
        onClick={async () => {
          router.push("/admin/service-listings");
        }}
        size="sm"
      />
      <Container mt="xl" mb="xl" size="70vw">
        <Box mb="xl">
          <LargeBackButton
            text="Back to Service Listings"
            onClick={async () => {
              router.push("/admin/service-listings");
            }}
            size="sm"
          />
        </Box>
        <PageTitle title={serviceListing?.title} />

        <Accordion
          multiple
          variant="filled"
          value={OPEN_FOREVER}
          onChange={() => {}}
          chevronSize={0}
          mt="md"
        >
          <Accordion.Item value="details" pl={30} pr={30} pt={15} pb={20}>
            <Group position="apart" mt={5}>
              <Group>
                <Text size="xl" fw={600}>
                  Service Listing Details
                </Text>
                <Badge
                  size="lg"
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan" }}
                >
                  ID: {serviceListing?.serviceListingId}
                </Badge>
              </Group>
              {canWrite && (
                <Group>
                  <DeleteActionButtonModal
                    title="Delete Service Listing"
                    subtitle="Are you sure you want to delete this service listing?"
                    onDelete={async () =>
                      handleDeleteServiceListing(serviceListingId)
                    }
                    large
                    miw={120}
                    variant="light"
                    sx={{ border: "1.5px  solid" }}
                  />
                </Group>
              )}
            </Group>
            <Box mb="md">
              <Divider mb="lg" mt="lg" />
              <Group>
                <IconListDetails size="1rem" color={theme.colors.indigo[5]} />{" "}
                <Text fw={600} size="md" ml={-5}>
                  Service Overview
                </Text>
              </Group>
              <Grid columns={24} mt="xs">
                {generateItemGroup(
                  "Title",
                  <Text fw={600}>{serviceListing?.title}</Text>,
                )}
                {generateItemGroup(
                  "Description",
                  <Box>
                    <Text lineClamp={showFullDescription ? 0 : 2} ref={textRef}>
                      {serviceListing?.description}
                    </Text>
                    <Group position="right">
                      <Button
                        compact
                        variant="subtle"
                        color="blue"
                        size="xs"
                        onClick={() => toggleShowFullDescription()}
                        mt="xs"
                        mr="xs"
                        display={textExceedsLineClamp ? "block" : "none"}
                      >
                        {showFullDescription ? "View less" : "View more"}
                      </Button>
                    </Group>
                  </Box>,
                )}
                {generateItemGroup(
                  "Category",
                  <>
                    {serviceListing?.category ? (
                      <Badge ml={-2}>
                        {formatStringToLetterCase(serviceListing?.category)}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </>,
                )}
                {generateItemGroup(
                  "Price",
                  <Text>
                    $ {formatNumber2Decimals(serviceListing?.basePrice)}
                  </Text>,
                )}
                {generateItemGroup(
                  "Date Created",
                  <Text>
                    {formatISODateTimeShort(serviceListing?.dateCreated)}
                  </Text>,
                )}
                {generateItemGroup(
                  "Last Updated",
                  <Text>
                    {serviceListing?.lastUpdated
                      ? formatISODateTimeShort(serviceListing?.lastUpdated)
                      : "-"}
                  </Text>,
                )}
                {generateItemGroup(
                  "Last Spotlighted",
                  <Text>
                    {serviceListing?.lastUpdated
                      ? formatISODateTimeShort(serviceListing?.listingTime)
                      : "-"}
                  </Text>,
                )}
              </Grid>
              <Divider mt="lg" mb="lg" />

              <Box mb="md">
                <Group>
                  <IconCalendarTime
                    size="1rem"
                    color={theme.colors.indigo[5]}
                  />
                  <Text fw={600} size="md" ml={-5}>
                    Scheduling
                  </Text>
                </Group>
                <Grid columns={24} mt="xs">
                  {generateItemGroup(
                    "Default Expiry Days",
                    <Text>{`${serviceListing?.defaultExpiryDays} ${
                      serviceListing?.defaultExpiryDays === 1 ? "day" : "days"
                    }`}</Text>,
                  )}
                  {generateItemGroup(
                    "Last Operational Date",
                    <Text>
                      {serviceListing?.lastPossibleDate
                        ? formatISODateLong(serviceListing?.lastPossibleDate)
                        : "None selected"}
                    </Text>,
                  )}
                  {generateItemGroup(
                    "Requires Booking",
                    serviceListing?.requiresBooking ? (
                      <Badge color="green" ml={-2}>
                        REQUIRED
                      </Badge>
                    ) : (
                      <Badge color="red" ml={-2}>
                        NOT REQUIRED
                      </Badge>
                    ),
                  )}
                  {generateItemGroup(
                    "Duration",
                    <Text>
                      {serviceListing?.duration
                        ? `${serviceListing.duration} minutes`
                        : "-"}
                    </Text>,
                    {
                      display: serviceListing?.requiresBooking
                        ? "block"
                        : "none",
                    },
                  )}
                </Grid>
                <Divider mt="lg" mb="lg" />
              </Box>

              <Box mb="md">
                <Group>
                  <IconPhotoPlus size="1rem" color={theme.colors.indigo[5]} />{" "}
                  <Text fw={600} size="md" ml={-5}>
                    Other Details
                  </Text>
                </Group>
                <Grid columns={24} mt="xs">
                  {generateItemGroup(
                    "Locations",
                    serviceListing?.addresses &&
                      serviceListing.addresses.length > 0 ? (
                      serviceListing.addresses.map((address) => (
                        <Badge
                          key={address.addressId}
                          color="violet"
                          radius="xs"
                          mr={4}
                          variant="dot"
                        >
                          {address.addressName}
                        </Badge>
                      ))
                    ) : (
                      <Text>None selected</Text>
                    ),
                  )}
                  {generateItemGroup(
                    "Tags",
                    serviceListing?.tags && serviceListing.tags.length > 0 ? (
                      serviceListing.tags.map((tag) => (
                        <Badge
                          key={tag.tagId}
                          color="violet"
                          radius="xs"
                          mr={4}
                        >
                          {tag.name}
                        </Badge>
                      ))
                    ) : (
                      <Text>None selected</Text>
                    ),
                  )}
                  {generateItemGroup(
                    "Display Images",
                    imagePreview.length == 0 ? (
                      <Text color="dimmed">No images uploaded</Text>
                    ) : (
                      <ImageCarousel
                        attachmentURLs={imagePreview}
                        altText="Service listing image"
                        imageHeight={400}
                      />
                    ),
                  )}
                </Grid>
              </Box>
            </Box>
          </Accordion.Item>
          <Accordion.Item
            value="details"
            pl={30}
            pr={30}
            pt={15}
            pb={15}
            mt={20}
          >
            <ServiceListingReview
              canWrite={canWrite}
              serviceListing={serviceListing}
              refetch={refetch}
            />
          </Accordion.Item>
        </Accordion>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const serviceListingId = context.params.id;
  const session = await getSession(context);
  if (!session) return { props: { serviceListingId } };

  const userId = session.user["userId"];
  const permissions = await (
    await api.get(`/rbac/users/${userId}/permissions`)
  ).data;
  return { props: { serviceListingId, permissions } };
}
