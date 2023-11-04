import {
  Group,
  Stack,
  Accordion,
  Center,
  Box,
  Text,
  Divider,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import { ServiceListing } from "shared-utils";
import StarRating from "../review/StarRating";
import ReviewFiltersGroup from "./ReviewFiltersGroup";
import ServiceReviewsTable from "./ServiceReviewsTable";

interface ServiceListingReviewsAccordionItemProps {
  serviceListing: ServiceListing;
  refetchServiceListing: () => Promise<any>;
}

const ServiceListingReviewsAccordionItem = ({
  serviceListing,
  refetchServiceListing,
}: ServiceListingReviewsAccordionItemProps) => {
  const [page, setPage] = useState<number>(1);
  const [filteredReviews, setFilteredReviews] = useState(
    serviceListing?.reviews,
  );
  const [statisticsVisible, toggleStatisticsVisibility] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "reviewId",
    direction: "asc",
  });

  const REVIEW_TABLE_SIZE = 6;

  useEffect(() => {
    setFilteredReviews(serviceListing?.reviews);
  }, [serviceListing]);

  const sortedReviews = sortBy(filteredReviews, sortStatus.columnAccessor);
  if (sortStatus.direction === "desc") {
    sortedReviews.reverse();
  }
  const from = (page - 1) * REVIEW_TABLE_SIZE;
  const to = from + REVIEW_TABLE_SIZE;
  const currentReviews = sortedReviews.slice(from, to);

  const overallRatingDisplay = (
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
          <Text mr="sm">out of 5</Text>
          <StarRating
            value={serviceListing?.overallRating}
            iconSize="1.85rem"
            allowFractions
            viewOnly
          />
        </Box>
      </Stack>
    </Center>
  );

  return (
    <Accordion.Item value="details" pl={30} pr={30} pt={15} pb={10} mt={20}>
      <Group position="apart" mt={5}>
        <Text size="xl">
          <b>Reviews ({serviceListing?.reviews?.length})</b>
        </Text>
        {serviceListing?.reviews?.length !== 0 && overallRatingDisplay}
      </Group>
      <Divider mt="lg" mb="lg" />

      {serviceListing?.reviews && serviceListing?.reviews?.length !== 0 ? (
        <>
          <ReviewFiltersGroup
            reviews={serviceListing?.reviews}
            setFilteredReviews={setFilteredReviews}
            setPage={setPage}
          />
          <ServiceReviewsTable
            records={currentReviews}
            totalRecords={filteredReviews.length}
            page={page}
            onPageChange={setPage}
            refetch={refetchServiceListing}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
          />
        </>
      ) : (
        <Text color="dimmed" size="sm">
          There are no reviews for this service listing.
        </Text>
      )}
    </Accordion.Item>
  );
};

export default ServiceListingReviewsAccordionItem;
