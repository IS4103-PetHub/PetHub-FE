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
  Alert,
  Divider,
  Stack,
  SegmentedControl,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCheck,
  IconClockHour8,
  IconFlag,
  IconMessageCircle,
  IconMessageCircle2,
  IconPhoto,
  IconThumbDown,
  IconThumbUp,
} from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  Review,
  ServiceListing,
  formatISODateTimeShort,
  getErrorMessageProps,
} from "shared-utils";
import { useToggleLikedReview } from "@/hooks/review";
import ImageCarousel from "../common/file/ImageCarousel";
import ReportModal from "./ReportModal";
import StarRating from "./StarRating";

interface ReviewOverviewCardProps {
  serviceListing: ServiceListing;
  setFilteredReviews: (reviews: Review[]) => void;
}

const ReviewOverviewCard = ({
  serviceListing,
  setFilteredReviews,
}: ReviewOverviewCardProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [activeStarFilter, setActiveStarFilter] = useState(null); // null means ALL
  const [withMedia, setWithMedia] = useState(false);
  const [withReply, setWithReply] = useState(false);

  const FILTER_BUTTON_PROPS = {
    variant: "filled",
    size: "xs",
    radius: "xs",
    miw: 50,
    compact: true,
    mr: "xs",
  };

  const ratingDisplay = (
    <Center>
      <Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          mb={-10}
        >
          <Text mr={5} fw={600} size="xl">
            {serviceListing?.overallRating?.toFixed(1)}{" "}
          </Text>
          <Text>out of 5</Text>
        </Box>
        <StarRating
          value={serviceListing?.overallRating}
          iconSize="1.75rem"
          allowFractions
          viewOnly
        />
      </Stack>
    </Center>
  );

  const starFiltersDisplay = (
    <Center>
      <Button
        {...FILTER_BUTTON_PROPS}
        onClick={() => handleStarFilter(null)}
        variant={activeStarFilter === null ? "filled" : "outline"}
      >
        All
      </Button>
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          {...FILTER_BUTTON_PROPS}
          onClick={() => handleStarFilter(star)}
          variant={activeStarFilter === star ? "filled" : "outline"}
        >
          {star} Paw
        </Button>
      ))}
    </Center>
  );

  const otherFiltersDisplay = (
    <Center>
      <Button
        {...FILTER_BUTTON_PROPS}
        variant={withMedia ? "filled" : "outline"}
        onClick={() => setWithMedia((prev) => !prev)}
        leftIcon={<IconPhoto size="1rem" style={{ marginRight: -5 }} />}
      >
        Only with media
      </Button>

      <Button
        {...FILTER_BUTTON_PROPS}
        variant={withReply ? "filled" : "outline"}
        onClick={() => setWithReply((prev) => !prev)}
        leftIcon={<IconMessageCircle size="1rem" style={{ marginRight: -5 }} />}
      >
        Only with replies
      </Button>
    </Center>
  );

  useEffect(() => {
    let filteredReviews = serviceListing?.reviews;
    // First filter by stars if not ALL
    if (activeStarFilter !== null) {
      filteredReviews = filteredReviews.filter(
        (review) => review.rating === activeStarFilter,
      );
    } else {
      setFilteredReviews(serviceListing?.reviews); // For the ALL filter
    }
    // Then filter by those with media only if selected
    if (withMedia) {
      filteredReviews = filteredReviews.filter(
        (review) => review.attachmentURLs?.length > 0,
      );
    }
    // Then filter by those with replies only if selected
    if (withReply) {
      filteredReviews = filteredReviews.filter((review) => !!review.reply);
    }
    setFilteredReviews(filteredReviews);
  }, [activeStarFilter, withMedia, withReply]);

  function handleStarFilter(star: number | null) {
    if (!star) {
      setActiveStarFilter(null); // Set filled filter to ALL button
      return;
    }
    setActiveStarFilter(star); // Set filled filter to the respective star buttons
  }

  return (
    <Card sx={{ backgroundColor: theme.colors.indigo[0] }}>
      <Grid columns={12}>
        <Grid.Col span={3}>{ratingDisplay}</Grid.Col>
        <Grid.Col span={9}>
          <Stack>
            {starFiltersDisplay}
            {otherFiltersDisplay}
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default ReviewOverviewCard;
