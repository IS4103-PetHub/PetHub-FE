import {
  Text,
  Button,
  Group,
  Box,
  Grid,
  Image,
  Center,
  Avatar,
  Flex,
  Alert,
  Divider,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconMessageCircle2 } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  Review,
  formatISODateTimeShort,
  getErrorMessageProps,
} from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ImageCarousel from "web-ui/shared/ImageCarousel";
import { useDeleteReview } from "@/hooks/reported-review";
import StarRating from "./StarRating";

interface ReviewItemProps {
  review: Review;
  refetch(): void;
  canWrite: boolean;
}

const ReviewItem = ({ review, refetch, canWrite }: ReviewItemProps) => {
  const queryClient = useQueryClient();
  const [showFullReview, toggleShowFullReview] = useToggle();
  const [textExceedsLineClamp, setTextExceedsLineClamp] = useState(false);
  const textRef = useRef(null);

  const [focusedImage, setFocusedImage] = useState(null);
  const [showImageCarousel, setShowImageCarousel] = useState(false);

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

  const deleteReviewMutation = useDeleteReview(queryClient);
  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteReviewMutation.mutateAsync(reviewId);
      notifications.show({
        title: "Review Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `Review ID: ${reviewId} deleted successfully.`,
      });
      refetch();
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Review", error),
      });
    }
  };

  const reviewContentCol = (
    <Grid.Col span={12}>
      <Box ml="md" mr="md">
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
  );

  const reviewImageCol = (
    <Grid.Col span={12} {...(textExceedsLineClamp ? { mt: -30 } : {})}>
      <Box ml="md" mr="md">
        {review?.attachmentURLs?.length > 0 && (
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
                      cursor: focusedImage === index ? "zoom-out" : "zoom-in",
                    }}
                  />
                </>
              </div>
            ))}
          </Flex>
        )}
      </Box>
    </Grid.Col>
  );

  const reviewImageCarouselCol = (
    <Grid.Col span={6} mt={10}>
      <Box ml="md" mr="md">
        <ImageCarousel
          attachmentURLs={review?.attachmentURLs}
          altText="Review Image"
          imageHeight={250}
          focusedImage={focusedImage}
          setFocusedImage={setFocusedImage}
        />
      </Box>
    </Grid.Col>
  );

  const sellerReplyCol = (
    <Grid.Col span={12} mt={10}>
      <Box ml="md" mr="md">
        <Alert
          icon={<IconMessageCircle2 size="1rem" />}
          title="Seller&#39;s Response"
          color="violet"
          radius="md"
        >
          <Box display="flex">
            <Text fw={500} mr={4}>
              {formatISODateTimeShort(review?.replyDate)} {">"}
            </Text>
            <Text>{review?.reply}</Text>
          </Box>
        </Alert>
      </Box>
    </Grid.Col>
  );

  return (
    <Box mt="md">
      <Grid columns={12}>
        <Grid.Col span={1}>
          <Avatar radius="xl" ml="md" />
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
        {canWrite && (
          <Grid.Col
            span={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Center mr="md">
              <DeleteActionButtonModal
                title={`Are you sure you want to delete this review?`}
                subtitle={
                  "Are you sure you want to delete this review? Please note that once deleted, the review will be permanently removed and cannot be recovered."
                }
                onDelete={() => handleDeleteReview(review.reviewId)}
              />
            </Center>
          </Grid.Col>
        )}

        {reviewContentCol}

        {reviewImageCol}

        {showImageCarousel && reviewImageCarouselCol}

        {review?.reply && sellerReplyCol}
      </Grid>

      <Divider mt="xl" />
    </Box>
  );
};

export default ReviewItem;
