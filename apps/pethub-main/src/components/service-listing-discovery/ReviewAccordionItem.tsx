import { Accordion, Group, useMantineTheme, Text } from "@mantine/core";
import { IconBlockquote } from "@tabler/icons-react";
import React from "react";
import { Review } from "shared-utils";
import SimpleOutlineButton from "web-ui/shared/SimpleOutlineButton";
import ReviewCard from "../review/ReviewCard";

interface ReviewAccordionItemProps {
  title: string;
  reviews: Review[];
  showFullReviews: boolean;
  setShowFullReviews(): void;
}

const ReviewAccordionItem = ({
  title,
  reviews,
  showFullReviews,
  setShowFullReviews,
}: ReviewAccordionItemProps) => {
  const theme = useMantineTheme();
  return (
    <Accordion.Item value="description" p="sm" mt="xl">
      <Accordion.Control
        icon={<IconBlockquote color={theme.colors.indigo[5]} />}
        sx={{ "&:hover": { cursor: "default" } }}
      >
        <Text size="xl" weight={600}>
          {title}
        </Text>
      </Accordion.Control>
      <Accordion.Panel ml={5} mr={5}>
        {reviews.map((review) => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
        <Group position="right" mt="md">
          <SimpleOutlineButton
            text={showFullReviews ? "View less" : "View more"}
            onClick={() => setShowFullReviews()}
          />
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default ReviewAccordionItem;
