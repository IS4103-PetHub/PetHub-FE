import { Carousel } from "@mantine/carousel";
import {
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
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import {
  downloadFile,
  extractFileName,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(
    PermissionsCodeEnum.WriteServiceListings,
  );
  const canRead = permissionCodes.includes(
    PermissionsCodeEnum.ReadServiceListings,
  );
  const [imagePreview, setImagePreview] = useState([]);
  const [showFullReview, toggleShowFullReview] = useToggle();
  const [textExceedsLineClamp, setTextExceedsLineClamp] = useState(false);
  const textRef = useRef(null);
  const { data: serviceListing, refetch } =
    useGetServiceListingById(serviceListingId);

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

  return (
    <>
      <Head>
        <title>Service Listing Details - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <LargeBackButton
        text="Back to Service Listing Management"
        onClick={() => {
          router.push("/admin/service-listings");
        }}
        size="sm"
        mb="md"
      />

      <Container fluid>
        <Paper style={{ width: "100%", margin: "0 auto" }}>
          <Group
            style={{
              width: "100%",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div style={{ flexGrow: 1, textAlign: "center" }}>
              <Text
                align="center"
                size="xl"
                weight={500}
                style={{ width: "100%" }}
                fw={700}
              >
                Service Listing Details
              </Text>
            </div>
            {canWrite && (
              <DeleteActionButtonModal
                title={`Are you sure you want to delete ${serviceListing?.title}?`}
                subtitle="Pet Owners would no longer be able to view this service listing."
                onDelete={() => {
                  handleDeleteServiceListing(serviceListingId);
                }}
              />
            )}
          </Group>
          <Divider />
          <Grid gutter="md" style={{ marginTop: "20px" }}>
            <Grid.Col span={3}>
              <Text fw={700}>Title:</Text>
            </Grid.Col>
            <Grid.Col span={9}>
              <Text>{serviceListing?.title}</Text>
            </Grid.Col>

            <Grid.Col span={3}>
              <Text fw={700}>Description:</Text>
            </Grid.Col>
            <Grid.Col span={9}>
              {/* {descriptionSection} */}
              <Box>
                <Text
                  sx={{ whiteSpace: "pre-line" }}
                  lineClamp={showFullReview ? 0 : 2}
                  size="xs"
                  mt="xs"
                  ref={textRef}
                >
                  {serviceListing?.description}
                </Text>
                <Group position="right">
                  <Button
                    compact
                    variant="subtle"
                    color="blue"
                    size="xs"
                    onClick={() => toggleShowFullReview()}
                    mt="xs"
                    mr="xs"
                    display={textExceedsLineClamp ? "block" : "none"}
                  >
                    {showFullReview ? "View less" : "View more"}
                  </Button>
                </Group>
              </Box>
            </Grid.Col>

            <Grid.Col span={3}>
              <Text fw={700}>Category:</Text>
            </Grid.Col>
            <Grid.Col span={9}>
              <Text>
                {serviceListing?.category
                  ? formatStringToLetterCase(serviceListing?.category)
                  : ""}
              </Text>
            </Grid.Col>

            <Grid.Col span={3}>
              <Text fw={700}>Price:</Text>
            </Grid.Col>
            <Grid.Col span={9}>
              <Text>${formatNumber2Decimals(serviceListing?.basePrice)}</Text>
            </Grid.Col>

            <Grid.Col span={3}>
              <Text fw={700}>Addresses:</Text>
            </Grid.Col>
            <Grid.Col span={9}>
              <Text>
                {serviceListing?.addresses
                  .map((addr) => addr.addressName)
                  .join(", ")}
              </Text>
            </Grid.Col>

            <Grid.Col span={3}>
              <Text fw={700}>Tags:</Text>
            </Grid.Col>
            <Grid.Col span={9}>
              <Text>
                {serviceListing?.tags && serviceListing.tags.length > 0 ? (
                  serviceListing.tags.map((tag, index) => (
                    <React.Fragment key={tag.tagId}>
                      <Badge color="blue">{tag.name}</Badge>
                      {index < serviceListing.tags.length - 1 && "\u00A0"}
                      {/* Add space if not the last tag */}
                    </React.Fragment>
                  ))
                ) : (
                  <Text>-</Text>
                )}
              </Text>
            </Grid.Col>
            <Grid.Col span={3}>
              <Text fw={700}>Date Created:</Text>
            </Grid.Col>
            <Grid.Col span={9}>
              <Text>
                {new Date(serviceListing?.dateCreated).toLocaleDateString()}
              </Text>
            </Grid.Col>

            <Grid.Col span={3}>
              <Text fw={700}>Last Updated:</Text>
            </Grid.Col>
            <Grid.Col span={9}>
              <Text>
                {serviceListing?.lastUpdated
                  ? new Date(serviceListing.lastUpdated).toLocaleDateString()
                  : "-"}
              </Text>
            </Grid.Col>

            <Grid.Col span={3}>
              <Text fw={700}>Requires Bookings:</Text>
            </Grid.Col>
            <Grid.Col span={9}>
              {serviceListing?.requiresBooking ? (
                <Badge color="green">Yes</Badge>
              ) : (
                <Badge color="red">No</Badge>
              )}
            </Grid.Col>

            {serviceListing?.requiresBooking && (
              <>
                <Grid.Col span={3}>
                  <Text fw={700}>Duration:</Text>
                </Grid.Col>
                <Grid.Col span={9}>
                  <Text>{serviceListing.duration} mins</Text>
                </Grid.Col>
              </>
            )}

            <Grid.Col span={3}>
              <Text fw={700}>Default Expiry Days:</Text>
            </Grid.Col>
            <Grid.Col span={9}>
              <Text>
                {serviceListing?.defaultExpiryDays
                  ? `${serviceListing.defaultExpiryDays} Days`
                  : "-"}
              </Text>
            </Grid.Col>

            <Grid.Col span={3}>
              <Text fw={700}>Last Possible Date:</Text>
            </Grid.Col>
            <Grid.Col span={9}>
              <Text>
                {serviceListing?.lastPossibleDate
                  ? new Date(
                      serviceListing.lastPossibleDate,
                    ).toLocaleDateString()
                  : "-"}
              </Text>
            </Grid.Col>

            <Grid.Col span={3}>
              <Text fw={700}>Pet Business Company Name:</Text>
            </Grid.Col>
            <Grid.Col span={9}>
              <Text>
                {serviceListing?.petBusiness
                  ? serviceListing.petBusiness.companyName
                  : "-"}
              </Text>
            </Grid.Col>
          </Grid>

          <Divider my="lg" />

          <Stack spacing="md">
            {imagePreview && imagePreview.length > 0 ? (
              <Carousel slideSize="33.333333%" loop slidesToScroll={3}>
                {imagePreview.map((imageUrl, index) => (
                  <div key={index} style={{ flex: "0 0 calc(33.33% - 10px)" }}>
                    <Card style={{ width: "100%" }}>
                      <Image
                        src={imageUrl}
                        alt={`Image Preview ${index}`}
                        style={{
                          maxWidth: "100%",
                          //maxHeight: "800px",
                          display: "block",
                        }}
                      />
                    </Card>
                  </div>
                ))}
              </Carousel>
            ) : (
              <Text mt="sm" mb="sm" ta="center" c="dimmed">
                No images available for this listing.
              </Text>
            )}
          </Stack>

          <Divider my="lg" />

          {/* reviews */}
          {/* TODO: add in reviews */}
        </Paper>
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
