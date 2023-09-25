import { Carousel } from "@mantine/carousel";
import {
  Container,
  Paper,
  Modal,
  Grid,
  Text,
  Image,
  Stack,
  Card,
  Badge,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { formatStringToLetterCase } from "shared-utils";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { ServiceListing } from "@/types/types";

interface ViewServiceListingModalProps {
  serviceListing: ServiceListing;
}

const ViewServiceListingModal = ({
  serviceListing,
}: ViewServiceListingModalProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    const fetchAndSetServiceListingFields = async () => {
      if (serviceListing) {
        await getFilesFromServiceListing(); // Wait for setServiceListingFields to complete
      }
    };

    fetchAndSetServiceListingFields(); // Immediately invoke the async function
  }, [serviceListing]);

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      return new File([buffer], fileName);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const extractFileName = (attachmentKeys: string) => {
    return attachmentKeys.substring(attachmentKeys.lastIndexOf("-") + 1);
  };

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

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        closeOnClickOutside={true}
        closeOnEscape={false}
        withCloseButton={true}
        centered
        size="80%"
      >
        <Container fluid>
          <Paper style={{ width: "100%", margin: "0 auto" }}>
            <Text
              align="center"
              size="xl"
              weight={500}
              style={{ marginBottom: "20px" }}
              fw={700}
            >
              Service Details
            </Text>
            <Divider />
            <Grid gutter="md" style={{ marginTop: "20px" }}>
              <Grid.Col span={6}>
                <Text fw={700}>Title:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>{serviceListing.title}</Text>
              </Grid.Col>

              {/* This writeup may be very long. Any suggestions on other ways i can present the info? */}
              <Grid.Col span={6}>
                <Text fw={700}>Description:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>{serviceListing.description}</Text>
              </Grid.Col>

              <Grid.Col span={6}>
                <Text fw={700}>Category:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>{formatStringToLetterCase(serviceListing.category)}</Text>
              </Grid.Col>

              <Grid.Col span={6}>
                <Text fw={700}>Price:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>${serviceListing.basePrice.toFixed(2)}</Text>
              </Grid.Col>

              {/* <Grid.Col span={6}>
                <Text fw={700}>Addresses:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  {serviceListing.addresses
                    .map((addr) => addr.addressName)
                    .join(", ")}
                </Text>
              </Grid.Col> */}

              <Grid.Col span={6}>
                <Text fw={700}>Tags:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  {serviceListing.tags && serviceListing.tags.length > 0 ? (
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
              <Grid.Col span={6}>
                <Text fw={700}>Date Created:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  {new Date(serviceListing.dateCreated).toLocaleDateString()}
                </Text>
              </Grid.Col>

              <Grid.Col span={6}>
                <Text fw={700}>Last Updated:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  {serviceListing.lastUpdated
                    ? new Date(serviceListing.lastUpdated).toLocaleDateString()
                    : "-"}
                </Text>
              </Grid.Col>

              <Grid.Col span={6}>
                <Text fw={700}>Pet Business Company Name:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  {serviceListing.petBusiness
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
                    <div
                      key={index}
                      style={{ flex: "0 0 calc(33.33% - 10px)" }}
                    >
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
          </Paper>
        </Container>
      </Modal>
      <ViewActionButton onClick={open} />
    </>
  );
};

export default ViewServiceListingModal;
