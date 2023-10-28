import {
  Accordion,
  Group,
  useMantineTheme,
  Text,
  Alert,
  Card,
  Grid,
  SegmentedControl,
  Center,
  Box,
} from "@mantine/core";
import {
  IconBlockquote,
  IconClockHour8,
  IconThumbUp,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { Review, ServiceListing } from "shared-utils";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SimpleOutlineButton from "web-ui/shared/SimpleOutlineButton";
import ReviewItem from "../review/ReviewItem";
import ReviewOverviewCard from "../review/ReviewOverviewCard";

interface ReviewAccordionItemProps {
  title: string;
  serviceListing: ServiceListing;
}

const ReviewAccordionItem = ({
  title,
  serviceListing,
}: ReviewAccordionItemProps) => {
  const theme = useMantineTheme();
  const [filteredReviews, setFilteredReviews] = useState(
    serviceListing?.reviews,
  );
  const [sorting, setSorting] = useState("latest"); // This is the default sorting returned by the BE

  useEffect(() => {
    if (sorting === "latest") {
      setFilteredReviews((prevReviews) =>
        [...prevReviews].sort(
          (a, b) =>
            new Date(b.dateCreated).getTime() -
            new Date(a.dateCreated).getTime(),
        ),
      );
    }
    if (sorting === "Most liked") {
      setFilteredReviews((prevReviews) =>
        [...prevReviews].sort((a, b) => b.likedByCount - a.likedByCount),
      );
    }
  }, [sorting]);

  const titleGroup = (
    <Group position="apart">
      <Text size="xl" weight={600}>
        {title}
      </Text>
      <SegmentedControl
        transitionDuration={300}
        transitionTimingFunction="ease"
        size="xs"
        color="indigo"
        radius="lg"
        value={sorting}
        onChange={setSorting}
        data={[
          {
            label: (
              <Center w={100}>
                <IconClockHour8 size="1rem" style={{ marginRight: -5 }} />
                <Box ml={10}>Latest</Box>
              </Center>
            ),
            value: "latest",
          },
          {
            label: (
              <Center w={100}>
                <IconThumbUp size="1rem" />
                <Box ml={10}>Most liked</Box>
              </Center>
            ),
            value: "Most liked",
          },
        ]}
      />
    </Group>
  );

  return (
    <Accordion.Item value="description" p="sm" mt="xl">
      <Accordion.Control
        icon={<IconBlockquote color={theme.colors.indigo[5]} />}
        sx={{ "&:hover": { cursor: "default" } }}
      >
        {titleGroup}
      </Accordion.Control>
      <Accordion.Panel ml={5} mr={5}>
        {serviceListing?.reviews && serviceListing?.reviews.length !== 0 && (
          <ReviewOverviewCard
            serviceListing={serviceListing}
            setFilteredReviews={setFilteredReviews}
          />
        )}
        {filteredReviews.length === 0 && (
          <SadDimmedMessage
            title="No Reviews Available"
            subtitle="Please choose another filter"
            replaceClass="center-vertically-but-shorter"
          />
        )}
        {filteredReviews.map((review) => (
          <ReviewItem key={review.reviewId} review={review} />
        ))}
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default ReviewAccordionItem;
