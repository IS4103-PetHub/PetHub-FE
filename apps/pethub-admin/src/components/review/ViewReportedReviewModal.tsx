import { Carousel } from "@mantine/carousel";
import {
  Accordion,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  Modal,
  Rating,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { IconFileReport, IconPaw } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import {
  Review,
  downloadFile,
  extractFileName,
  formatEnumValueToLowerCase,
  formatStringToLetterCase,
} from "shared-utils";
import ViewActionButton from "web-ui/shared/ViewActionButton";

interface ViewReportedReviewModalProps {
  review: Review;
  canWrite: boolean;
  onDelete(): void;
  onResolve(): void;
}

const ViewReportedReviewModal = ({
  review,
  canWrite,
  onDelete,
  onResolve,
}: ViewReportedReviewModalProps) => {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [imagePreview, setImagePreview] = useState([]);
  const defaultValues = ["Review Details"];
  const [showFullReview, toggleShowFullReview] = useToggle();
  const [textExceedsLineClamp, setTextExceedsLineClamp] = useState(false);
  const textRef = useRef(null);
  const reportedReasons = Array.from(
    new Set(
      review.reportedBy.map((report) =>
        formatStringToLetterCase(report.reportReason),
      ),
    ),
  );

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const textHeight = textRef.current.clientHeight;
      // Check if text exceeds 2 lines
      if (textHeight > lineHeight * 2) {
        setTextExceedsLineClamp(true);
      }
    }
    const fetchAndSetImages = async () => {
      if (review) {
        await setImages();
      }
    };
    fetchAndSetImages();
  }, [review]);

  const setImages = async () => {
    const fileNames = review.attachmentKeys.map((keys) =>
      extractFileName(keys),
    );

    const downloadPromises = fileNames.map((filename, index) => {
      const url = review.attachmentURLs[index];
      return downloadFile(url, filename).catch((error) => {
        console.error(`Error downloading file ${filename}:`, error);
        return null; // Return null for failed downloads
      });
    });

    const downloadedFiles: File[] = await Promise.all(downloadPromises);
    const imageUrls = downloadedFiles.map((file) => URL.createObjectURL(file));
    setImagePreview(imageUrls);
  };

  function renderItemGroup(label: string, value: string | any[]) {
    if (Array.isArray(value) && value.length > 0) {
      return (
        <>
          <Group position="apart" ml="xs" mr="xs" mb="md">
            <Text fw={600}>{label}:</Text>
            <Text size="sm">
              {value.map((item, index) => (
                <span key={item.id}>
                  {index > 0 ? ", " : ""}
                  {item.name}
                </span>
              ))}
            </Text>
          </Group>
        </>
      );
    } else if (typeof value === "string") {
      return (
        <>
          {value && (
            <>
              <Grid.Col span={2}>
                <Text fw={600}>{label}</Text>
              </Grid.Col>
              <Grid.Col span={10}>
                <Text>{value}</Text>
              </Grid.Col>
            </>
          )}
        </>
      );
    }
    return null;
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        closeOnClickOutside={true}
        closeOnEscape={false}
        withCloseButton={true}
        title={
          <Group>
            <Text size="lg" weight={500}>
              Reported Review
            </Text>
          </Group>
        }
        centered
        size="80%"
      >
        <Container fluid>
          <Accordion variant="separated" multiple defaultValue={defaultValues}>
            <Accordion.Item value="Review Details">
              <Accordion.Control>
                <Group>
                  <IconFileReport color={theme.colors.indigo[5]} />
                  <Text size="lg">Review Details</Text>
                  <Badge color="red">
                    Reported by {review.reportedBy.length} users
                  </Badge>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Grid>
                  {renderItemGroup(
                    "Name:",
                    `${review.orderItem.invoice.PetOwner.firstName} ${review.orderItem.invoice.PetOwner.lastName}`,
                  )}
                  {renderItemGroup("Title:", `${review.title}`)}
                  <Grid.Col span={2}>
                    <Text fw={600}>Comment:</Text>
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <Box>
                      <Text
                        sx={{ whiteSpace: "pre-line" }}
                        lineClamp={showFullReview ? 0 : 2}
                        size="xs"
                        mt="xs"
                        ref={textRef}
                      >
                        {review.comment}
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
                  <Grid.Col span={2}>
                    <Text fw={600}>Rating:</Text>
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <Rating
                      emptySymbol={
                        <IconPaw
                          size="2rem"
                          color={theme.colors.yellow[7]}
                          strokeWidth={1.5}
                        />
                      }
                      fullSymbol={
                        <IconPaw
                          size="2rem"
                          color={theme.colors.yellow[7]}
                          fill={theme.colors.yellow[4]}
                          strokeWidth={1.5}
                        />
                      }
                      value={review.rating}
                    />
                  </Grid.Col>
                  {review.reply && renderItemGroup("Reply:", `${review.reply}`)}
                  {renderItemGroup("Reasons:", reportedReasons.join(", "))}
                  <Grid.Col span={12}>
                    <Stack spacing="md">
                      {imagePreview && imagePreview.length > 0 ? (
                        <Carousel
                          slideSize="33.333333%"
                          loop
                          slidesToScroll={3}
                        >
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
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Group position="right">
                      <Button onClick={() => onDelete()} color="red">
                        Remove
                      </Button>
                      <Button onClick={() => onResolve()} color="teal">
                        Resolve
                      </Button>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>
            {/* accordian with SL details */}
            <Accordion.Item value="Service Listing Details">
              <Accordion.Control>
                <Group>
                  <IconFileReport color={theme.colors.indigo[5]} />
                  <Text size="lg">Sevice Listing Details</Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Grid>
                  {renderItemGroup(
                    "Pet Business:",
                    `${review.serviceListing.petBusiness.companyName}`,
                  )}
                  {renderItemGroup(
                    "Service:",
                    `${review.serviceListing.title}`,
                  )}
                  {renderItemGroup(
                    "Category:",
                    `${formatStringToLetterCase(
                      review.serviceListing.category,
                    )}`,
                  )}
                  {renderItemGroup(
                    "Description:",
                    `${review.serviceListing.description}`,
                  )}
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Container>
      </Modal>
      <ViewActionButton onClick={open} />
    </>
  );
};

export default ViewReportedReviewModal;
