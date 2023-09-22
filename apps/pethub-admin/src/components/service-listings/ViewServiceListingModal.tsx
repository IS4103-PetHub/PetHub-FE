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
import React, { useState } from "react";
import { formatStringToLetterCase } from "shared-utils";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { ServiceListing } from "@/types/types";

interface ViewServiceListingModalProps {
  serviceListing: ServiceListing;
}

const ViewServiceListingModal = ({
  serviceListing,
}: ViewServiceListingModalProps) => {
  /*
   * Component State
   */
  const [opened, { open, close }] = useDisclosure(false);
  const [imagePreview, setImagePreview] = useState([]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        closeOnClickOutside={true}
        closeOnEscape={false}
        withCloseButton={true}
        centered
        padding="1.5rem"
        size="md"
      >
        <Container fluid>
          <Paper p="md" pt={0} style={{ width: "100%", margin: "0 auto" }}>
            <Text
              align="center"
              size="xl"
              weight={500}
              style={{ marginBottom: "20px" }}
            >
              Service Details
            </Text>
            <Divider />
            <Grid gutter="md" style={{ marginTop: "20px" }}>
              <Grid.Col span={6}>
                <Text>Title:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>{serviceListing.title}</Text>
              </Grid.Col>

              {/* This writeup may be very long. Any suggestions on other ways i can present the info? */}
              <Grid.Col span={6}>
                <Text>Description:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>{serviceListing.description}</Text>
              </Grid.Col>

              <Grid.Col span={6}>
                <Text>Category:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>{formatStringToLetterCase(serviceListing.category)}</Text>
              </Grid.Col>

              <Grid.Col span={6}>
                <Text>Price:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>${serviceListing.basePrice.toFixed(2)}</Text>
              </Grid.Col>

              <Grid.Col span={6}>
                <Text>Addresses:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  {serviceListing.addresses
                    .map((addr) => addr.addressName)
                    .join(", ")}
                </Text>
              </Grid.Col>

              <Grid.Col span={6}>
                <Text>Tags:</Text>
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
                <Text>Date Created:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  {new Date(serviceListing.dateCreated).toLocaleDateString()}
                </Text>
              </Grid.Col>

              <Grid.Col span={6}>
                <Text>Last Updated:</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  {serviceListing.lastUpdated
                    ? new Date(serviceListing.lastUpdated).toLocaleDateString()
                    : "-"}
                </Text>
              </Grid.Col>
            </Grid>

            <Divider my="lg" />

            <Stack spacing="md">
              {imagePreview && imagePreview.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {imagePreview.map((imageUrl, index) => (
                    <div
                      key={index}
                      style={{ flex: "0 0 calc(33.33% - 10px)" }}
                    >
                      <Card style={{ maxWidth: "100%" }}>
                        <Image
                          src={imageUrl}
                          alt={`Image Preview ${index}`}
                          style={{ maxWidth: "100%", display: "block" }}
                        />
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <Text>No images available for this listing.</Text>
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
