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
  RefundRequest,
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
import ViewReviewModal from "../service-listing-management/ViewReviewModal";

interface RefundTableProps {
  records: RefundRequest[];
  totalRecords: number;
  refetch(): Promise<any>;
  page: number;
  onPageChange(p: number): void;
  sortStatus: DataTableSortStatus;
  onSortStatusChange(status: DataTableSortStatus): void;
}

const RefundTable = ({
  records,
  totalRecords,
  refetch,
  page,
  onPageChange,
  sortStatus,
  onSortStatusChange,
}: RefundTableProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [
    refundModalOpened,
    { open: openRefundModal, close: closeRefundModal },
  ] = useDisclosure(false);
  const [selectedRefund, setSelectedRefund] = useState(null);

  const REVIEW_TABLE_SIZE = 6;

  const viewReviewDetails = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    openRefundModal();
  };

  // Reset the state of selected refund whenever refetch is called in that component
  useEffect(() => {
    if (refundModalOpened && selectedRefund) {
      const updatedRefund = records.find(
        (r) => r.refundRequestId === selectedRefund.refundRequestId,
      );
      if (updatedRefund) {
        setSelectedRefund(updatedRefund);
      }
    }
  }, [records, refundModalOpened, selectedRefund]);

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
            accessor: "refundRequestId",
            title: "ID",
            textAlignment: "right",
            width: "4vw",
            sortable: true,
          },
          {
            accessor: "status",
            title: "Status",
            textAlignment: "left",
            width: "22vw",
            sortable: true,
            ellipsis: true,
          },
          // Put details on order here and lead to order
          {
            accessor: "createdAt",
            title: "Requested At",
            textAlignment: "left",
            width: "9vw",
            sortable: true,
            render: (record) => formatISODateTimeShort(record.createdAt),
          },
          {
            accessor: "processedAt",
            title: "Processed At",
            textAlignment: "left",
            width: "9vw",
            sortable: true,
            render: (record) =>
              record.processedAt
                ? formatISODateTimeShort(record.processedAt)
                : "-",
          },
          {
            // actions
            accessor: "actions",
            title: "View Details",
            width: 150,
            textAlignment: "right",
            render: (refund) => (
              <Group position="right">
                <div onClick={(e) => e.stopPropagation()}>
                  <ViewActionButton onClick={() => viewReviewDetails(refund)} />
                </div>
              </Group>
            ),
          },
        ]}
      />
    </>
  );
};

export default RefundTable;
