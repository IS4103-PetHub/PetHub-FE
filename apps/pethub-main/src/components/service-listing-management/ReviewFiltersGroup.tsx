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
  Stack,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconMessageCircle, IconPhoto } from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Review, ServiceListing } from "shared-utils";
import StarRating from "../review/StarRating";

interface ReviewFiltersGroupProps {
  reviews: Review[];
  setFilteredReviews: (reviews: Review[]) => void;
}

const ReviewFiltersGroup = ({
  reviews,
  setFilteredReviews,
}: ReviewFiltersGroupProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [activeStarFilter, setActiveStarFilter] = useState(null); // null means ALL
  const [withMedia, setWithMedia] = useState(false);
  const [withReply, setWithReply] = useState(false);

  const starCounts = computeStarCounts();

  const FILTER_BUTTON_PROPS = {
    variant: "filled",
    size: "xs",
    radius: "xs",
    miw: 65,
    compact: true,
    mr: "xs",
  };

  const starFiltersDisplay = (
    <Center>
      <Button
        {...FILTER_BUTTON_PROPS}
        onClick={() => handleStarFilter(null)}
        variant={activeStarFilter === null ? "filled" : "outline"}
      >
        All
      </Button>
      {[1, 2, 3, 4, 5].map((star, index) => (
        <Button
          key={star}
          {...FILTER_BUTTON_PROPS}
          onClick={() => handleStarFilter(star)}
          variant={activeStarFilter === star ? "filled" : "outline"}
        >
          {star} Paw&nbsp;<Text size={11}>({starCounts[index]})</Text>
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
    let filteredReviews = reviews;
    // First filter by stars if not ALL
    if (activeStarFilter !== null) {
      filteredReviews = filteredReviews.filter(
        (review) => review.rating === activeStarFilter,
      );
    } else {
      setFilteredReviews(reviews); // For the ALL filter
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

  function computeStarCounts() {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[review.rating - 1]++;
      }
    });
    return counts;
  }

  return (
    <Group position="apart" mb="md">
      {starFiltersDisplay}
      {otherFiltersDisplay}
    </Group>
  );
};

export default ReviewFiltersGroup;
