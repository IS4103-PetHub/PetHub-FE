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
  SegmentedControl,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconList,
  IconMessage,
  IconMessage2Off,
  IconMessageCircle,
  IconPhoto,
  IconThumbUp,
} from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";
import { IconClockHour8 } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Review, ServiceListing } from "shared-utils";
import StarRating from "../review/StarRating";

interface ReviewFiltersGroupProps {
  reviews: Review[];
  setFilteredReviews: (reviews: Review[]) => void;
  setPage: (page: number) => void;
}

const ReviewFiltersGroup = ({
  reviews,
  setFilteredReviews,
  setPage,
}: ReviewFiltersGroupProps) => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeStarFilter, setActiveStarFilter] = useState(null); // null means ALL

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
          {star} Paw{star > 1 ? "s" : ""}&nbsp;
          <Text size={11}>({starCounts[index]})</Text>
        </Button>
      ))}
    </Center>
  );

  const tabsDisplay = (
    <SegmentedControl
      value={activeTab}
      size="xs"
      radius="xs"
      onChange={(tab) => {
        setActiveTab(tab);
        setPage(1); // Reset page to 1
      }}
      data={[
        {
          label: (
            <Center w={100}>
              <IconList size="1rem" />
              <Box ml={10}>All</Box>
            </Center>
          ),
          value: "All",
        },
        {
          label: (
            <Center w={100}>
              <IconMessage size="1rem" />
              <Box ml={10}>To Reply</Box>
            </Center>
          ),
          value: "To Reply",
        },
        {
          label: (
            <Center w={100}>
              <IconMessage2Off size="1rem" />
              <Box ml={10}>Replied</Box>
            </Center>
          ),
          value: "Replied",
        },
      ]}
    />
  );

  useEffect(() => {
    let filteredReviews = reviews;

    if (activeStarFilter !== null) {
      filteredReviews = filteredReviews.filter(
        (review) => review.rating === activeStarFilter,
      );
    }

    switch (activeTab) {
      case "To Reply":
        filteredReviews = filteredReviews.filter((review) => !review.reply);
        break;
      case "Replied":
        filteredReviews = filteredReviews.filter((review) => !!review.reply);
        break;
      default:
        break; // no filtering for ALL
    }

    setFilteredReviews(filteredReviews);
  }, [activeStarFilter, activeTab]);

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
      {tabsDisplay}
      {starFiltersDisplay}
    </Group>
  );
};

export default ReviewFiltersGroup;
