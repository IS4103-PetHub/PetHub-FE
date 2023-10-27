import {
  useMantineTheme,
  Text,
  Card,
  Button,
  Group,
  Box,
  Grid,
  Image,
  Center,
  Avatar,
  ActionIcon,
  Flex,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconFlag, IconThumbUp } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Review, formatISODateTimeShort } from "shared-utils";
import ImageCarousel from "../common/file/ImageCarousel";
import ReportModal from "./ReportModal";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [
    reportModalOpened,
    { open: openReportModal, close: closeReportModal },
  ] = useDisclosure(false);

  const [showFullReview, toggleShowFullReview] = useToggle();
  const [textExceedsLineClamp, setTextExceedsLineClamp] = useState(false);
  const textRef = useRef(null);

  const [focusedImage, setFocusedImage] = useState(null);
  const [showImageCarousel, setShowImageCarousel] = useState(false);

  const flaggedPlaceholder = false;

  // function hasUserAlreadyReportedReview() {
  //   return review?.reportReviews?.some((report) => report?.reporterId === router?.query?.petOwnerId);
  // }

  console.log("review", review);

  // This is a hacky way to check if the text exceeds 2 lines in the DOM
  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const textHeight = textRef.current.clientHeight;
      // Check if text exceeds 2 lines
      if (textHeight > lineHeight * 2) {
        setTextExceedsLineClamp(true);
      }
    }
  }, [review]);

  const handleImageThumbnailClick = (index) => {
    // If the image being clicked it already focused, close the carousel and unset focused image. Else set the focused image to it and open the carousel
    if (focusedImage === index) {
      setFocusedImage(null);
      setShowImageCarousel(false);
    } else {
      setFocusedImage(index);
      setShowImageCarousel(true);
    }
  };

  return (
    <Card withBorder radius="md" shadow="xs" mb="md">
      <Grid columns={12}>
        <Grid.Col span={1}>
          <Avatar radius="xl" />
        </Grid.Col>

        <Grid.Col span={9}>
          <Box>
            <Text size="xs" fw={500}>
              {review?.orderItem?.invoice?.PetOwner?.firstName}{" "}
              {review?.orderItem?.invoice?.PetOwner?.lastName}
            </Text>
            <Text lineClamp={2} size="xs" color="dimmed">
              Reviewed on {formatISODateTimeShort(review.dateCreated)}
            </Text>
          </Box>
        </Grid.Col>

        <Grid.Col
          span={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Center>
            <ActionIcon onClick={() => alert("Mark as helpful")}>
              <IconThumbUp
                size="1rem"
                {...(flaggedPlaceholder ? { filled: "gray" } : {})}
              />
            </ActionIcon>
            <ActionIcon onClick={openReportModal}>
              <IconFlag
                size="1rem"
                {...(flaggedPlaceholder ? { filled: "gray" } : {})}
              />
            </ActionIcon>
          </Center>
        </Grid.Col>

        <Grid.Col span={12}>
          <Box ml="md">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StarRating
                value={review?.rating}
                viewOnly
                allowFractions
                iconSize="1.25rem"
              />
              <Text fw={600} size={16} ml={3}>
                {review?.title}
              </Text>
            </Box>
            <Box>
              <Text
                sx={{ whiteSpace: "pre-line" }}
                lineClamp={showFullReview ? 0 : 2}
                size="xs"
                mt="xs"
                ref={textRef}
              >
                {review?.comment}
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
          </Box>
        </Grid.Col>

        <Grid.Col span={12} {...(textExceedsLineClamp ? { mt: -30 } : {})}>
          <Box ml="md">
            {review?.attachmentURLs?.length > 0 ? (
              <Flex wrap="wrap" justify="start" align="center" gap="xs">
                {review.attachmentURLs.map((url, index) => (
                  <div
                    key={index}
                    style={{
                      width: "100px",
                      height: "60px",
                      position: "relative",
                      border: index === focusedImage ? "1.5px red solid" : "",
                      overflow: "hidden",
                      marginRight: "10px",
                    }}
                  >
                    <>
                      <Image
                        radius="md"
                        src={url}
                        fit="cover"
                        w="full"
                        h="full"
                        alt="Review Image Thumbnail"
                        onClick={() => handleImageThumbnailClick(index)}
                        style={{
                          cursor:
                            focusedImage === index ? "zoom-out" : "zoom-in",
                        }}
                      />
                    </>
                  </div>
                ))}
              </Flex>
            ) : (
              <Image
                radius="md"
                src="/pethub-placeholder.png"
                fit="contain"
                w="auto"
                alt="Review Photo"
              />
            )}
          </Box>
        </Grid.Col>

        {showImageCarousel && (
          <Grid.Col span={6} mt={10}>
            <Box ml="md">
              <ImageCarousel
                attachmentURLs={review?.attachmentURLs}
                altText="Review Image"
                imageHeight={250}
                focusedImage={focusedImage}
                setFocusedImage={setFocusedImage}
              />
            </Box>
          </Grid.Col>
        )}
      </Grid>

      <ReportModal
        reviewId={review?.reviewId}
        opened={reportModalOpened}
        onClose={closeReportModal}
      />
    </Card>
  );
};

export default ReviewCard;
