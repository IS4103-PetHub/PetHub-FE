import {
  useMantineTheme,
  Text,
  Button,
  Group,
  Box,
  Grid,
  Image,
  Center,
  Avatar,
  ActionIcon,
  Flex,
  Alert,
  Divider,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconFlag,
  IconMessageCircle2,
  IconThumbDown,
  IconThumbUp,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  Review,
  formatISODateTimeShort,
  getErrorMessageProps,
} from "shared-utils";
import ImageCarousel from "web-ui/shared/ImageCarousel";
import { useToggleLikedReview } from "@/hooks/review";
import ReportModal from "./ReportModal";
import StarRating from "./StarRating";

interface ReviewItemProps {
  review: Review;
  isLikedByUser: boolean;
  isReportedByUser: boolean;
  refetchLikedAndReportedReviewIds?: () => Promise<any>;
  hideIconButtons?: boolean;
}

const ReviewItem = ({
  review,
  isLikedByUser,
  isReportedByUser,
  refetchLikedAndReportedReviewIds,
  hideIconButtons,
}: ReviewItemProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [likedCount, setLikedCount] = useState(review.likedByCount || 0);
  const [
    reportModalOpened,
    { open: openReportModal, close: closeReportModal },
  ] = useDisclosure(false);

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

  const handleReport = () => {
    if (isReportedByUser) {
      notifications.show({
        title: `Review Already Reported`,
        color: "orange",
        icon: <IconAlertCircle />,
        message:
          "You have already reported this review. Please wait for PetHub staff to investigate this review and take the appropriate action.",
      });
      return;
    }
    openReportModal();
  };

  const createToggleLikedReviewMutation = useToggleLikedReview();
  const toggleLikedReview = async () => {
    try {
      const res = await createToggleLikedReviewMutation.mutateAsync(
        review?.reviewId,
      );
      notifications.show({
        title: `Review ${res.liked ? "Liked" : "Unliked"}`,
        color: "green",
        icon: res.liked ? <IconThumbUp /> : <IconThumbDown />,
        message: res.liked
          ? "Your like helps other pet owners easily discover this review"
          : "You have unliked this review",
      });
      if (refetchLikedAndReportedReviewIds)
        await refetchLikedAndReportedReviewIds();
      if (res.liked) {
        // update the count
        setLikedCount((prevCount) => prevCount + 1);
      } else {
        setLikedCount((prevCount) => prevCount - 1);
      }
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(`Error Toggling Liked Review`, error),
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
          imageHeight={350}
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

        <Grid.Col
          span={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          {!hideIconButtons && (
            <Center mr="md">
              <ActionIcon onClick={toggleLikedReview}>
                <IconThumbUp
                  size="1rem"
                  {...(isLikedByUser ? { fill: "gray" } : {})}
                />
                {likedCount ? (
                  <Text size="xs" mt="xs">
                    {likedCount}
                  </Text>
                ) : null}
              </ActionIcon>
              <ActionIcon onClick={handleReport}>
                <IconFlag
                  size="1rem"
                  {...(isReportedByUser ? { fill: "gray" } : {})}
                />
              </ActionIcon>
            </Center>
          )}
        </Grid.Col>

        {reviewContentCol}

        {reviewImageCol}

        {showImageCarousel && reviewImageCarouselCol}

        {review?.reply && sellerReplyCol}
      </Grid>

      <Divider mt="xl" />

      <ReportModal
        reviewId={review?.reviewId}
        opened={reportModalOpened}
        onClose={closeReportModal}
        onReported={refetchLikedAndReportedReviewIds}
      />
    </Box>
  );
};

export default ReviewItem;
