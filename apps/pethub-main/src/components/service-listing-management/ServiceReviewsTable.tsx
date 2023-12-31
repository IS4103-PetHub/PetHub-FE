import { Group, Badge, Text, Alert, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Review,
  formatISODateTimeShort,
  getErrorMessageProps,
  getMinTableHeight,
} from "shared-utils";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import StarRating from "../review/StarRating";
import ViewReviewModal from "./ViewReviewModal";

interface ServiceReviewsTableProps {
  records: Review[];
  totalRecords: number;
  refetch(): Promise<any>;
  page: number;
  onPageChange(p: number): void;
  sortStatus: DataTableSortStatus;
  onSortStatusChange(status: DataTableSortStatus): void;
}

const ServiceReviewsTable = ({
  records,
  totalRecords,
  refetch,
  page,
  onPageChange,
  sortStatus,
  onSortStatusChange,
}: ServiceReviewsTableProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [
    reviewModalOpened,
    { open: openReviewModal, close: closeReviewModal },
  ] = useDisclosure(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const REVIEW_TABLE_SIZE = 6;

  const viewReviewDetails = (review: Review) => {
    setSelectedReview(review);
    openReviewModal();
  };

  // Reset the state of selected review whenever refetch is called in that component
  useEffect(() => {
    if (reviewModalOpened && selectedReview) {
      const updatedReview = records.find(
        (r) => r.reviewId === selectedReview.reviewId,
      );
      if (updatedReview) {
        setSelectedReview(updatedReview);
      }
    }
  }, [records, reviewModalOpened, selectedReview]);

  return (
    <>
      <DataTable
        minHeight={getMinTableHeight(records)}
        records={records}
        sortStatus={sortStatus}
        onSortStatusChange={onSortStatusChange}
        withBorder
        withColumnBorders
        striped
        verticalSpacing="xs"
        highlightOnHover
        onRowClick={(record) => viewReviewDetails(record)}
        idAccessor="reviewId"
        totalRecords={totalRecords}
        recordsPerPage={REVIEW_TABLE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
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
            title: "View and Reply",
            width: 150,
            textAlignment: "right",
            render: (review) => (
              <Group position="right">
                <div onClick={(e) => e.stopPropagation()}>
                  <ViewActionButton onClick={() => viewReviewDetails(review)} />
                </div>
              </Group>
            ),
          },
        ]}
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
