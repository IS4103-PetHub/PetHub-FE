import { Group, Badge, Text, Alert, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Address,
  CalendarGroup,
  Review,
  ServiceListing,
  Tag,
  formatISODateTimeShort,
  getErrorMessageProps,
  getMinTableHeight,
  isValidServiceListing,
} from "shared-utils";
import { formatStringToLetterCase } from "shared-utils";
import { TABLE_PAGE_SIZE } from "shared-utils";
import { formatNumber2Decimals } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditActionButton from "web-ui/shared/EditActionButton";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { useDeleteServiceListingById } from "@/hooks/service-listing";
import StarRating from "../review/StarRating";
import ServiceListingModal from "./ServiceListingModal";
import ViewReviewModal from "./ViewReviewModal";

interface ServiceReviewsTableProps {
  records: Review[];
  refetch(): Promise<any>;
  page: number;
  onPageChange(p: number): void;
}

const ServiceReviewsTable = ({
  records,
  refetch,
  page,
  onPageChange,
}: ServiceReviewsTableProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteServiceListingMutation = useDeleteServiceListingById(queryClient);
  const [
    reviewModalOpened,
    { open: openReviewModal, close: closeReviewModal },
  ] = useDisclosure(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const viewReviewDetails = (review: Review) => {
    setSelectedReview(review);
    openReviewModal();
  };

  const handleDeleteService = async (serviceListingId: number) => {
    try {
      await deleteServiceListingMutation.mutateAsync(serviceListingId);
      refetch();
      notifications.show({
        message: "Service Successfully Deleted",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Service Listing", error),
      });
    }
  };

  return (
    <>
      <DataTable
        minHeight={getMinTableHeight(records)}
        columns={[
          {
            accessor: "reviewId",
            title: "ID",
            textAlignment: "right",
            width: "4vw",
            sortable: true,
          },
          {
            accessor: "title",
            title: "Title",
            textAlignment: "left",
            width: "22vw",
            sortable: true,
            ellipsis: true,
          },
          {
            accessor: "rating",
            title: "Rating",
            textAlignment: "left",
            width: "9vw",
            sortable: true,
            render: (record) => (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StarRating value={record.rating} viewOnly iconSize="1rem" />
                <Text ml={4}>({record.rating})</Text>
              </Box>
            ),
          },
          {
            accessor: "dateCreated",
            title: "Reviewed On",
            textAlignment: "left",
            width: "9vw",
            sortable: true,
            render: (record) => formatISODateTimeShort(record.dateCreated),
          },
          {
            accessor: "replyDate",
            title: "Replied on",
            textAlignment: "left",
            width: "9vw",
            sortable: true,
            render: (record) =>
              record.replyDate ? formatISODateTimeShort(record.replyDate) : "-",
          },
          {
            // actions
            accessor: "actions",
            title: "Actions",
            width: 150,
            textAlignment: "right",
            render: (review) => (
              <Group position="right">
                <div onClick={(e) => e.stopPropagation()}>
                  <ViewActionButton onClick={() => viewReviewDetails(review)} />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <DeleteActionButtonModal
                    title={`Are you sure you want to delete ${review.title}?`}
                    subtitle="The customer would no longer be able to view this service listing."
                    onDelete={() => {}}
                  />
                </div>
              </Group>
            ),
          },
        ]}
        records={records}
        withBorder
        withColumnBorders
        striped
        verticalSpacing="sm"
        highlightOnHover
        onRowClick={(record) => viewReviewDetails(record)}
        idAccessor="reviewId"
        totalRecords={records.length}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
      />
      <ViewReviewModal
        onClose={closeReviewModal}
        opened={reviewModalOpened}
        review={selectedReview}
        refetch={refetch}
      />
    </>
  );
};

export default ServiceReviewsTable;
