import { ActionIcon, Group, Rating, useMantineTheme } from "@mantine/core";
import { IconFileDownload, IconPaw } from "@tabler/icons-react";
import dayjs from "dayjs";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { Review, TABLE_PAGE_SIZE, getMinTableHeight } from "shared-utils";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import ViewReportedReviewModal from "./ViewReportedReviewModal";

interface ReportedReviewTableProps {
  records: Review[];
  page: number;
  sortStatus: DataTableSortStatus;
  onSortStatusChange: any;
  onPageChange(p: number): void;
  totalNumRecords: number;
  canWrite: boolean;
  onDelete(id: number): void;
  onResolve(id: number): void;
}

const ReportedReviewTable = ({
  records,
  page,
  sortStatus,
  onSortStatusChange,
  onPageChange,
  totalNumRecords,
  canWrite,
  onDelete,
  onResolve,
}: ReportedReviewTableProps) => {
  const theme = useMantineTheme();

  return (
    <DataTable
      minHeight={getMinTableHeight(records)}
      records={records}
      withBorder
      withColumnBorders
      striped
      verticalSpacing="sm"
      idAccessor="reviewId"
      //sorting
      sortStatus={sortStatus}
      onSortStatusChange={onSortStatusChange}
      //pagination
      totalRecords={totalNumRecords}
      recordsPerPage={TABLE_PAGE_SIZE}
      page={page}
      onPageChange={(p) => onPageChange(p)}
      columns={[
        {
          accessor: "reviewId",
          title: "ID",
          textAlignment: "left",
          sortable: true,
          width: "50px",
        },
        {
          accessor: "orderItem.invoice.petOwner.firstName", // Access the first name
          title: "Reviewer",
          textAlignment: "left",
          sortable: true,
          ellipsis: true,
          width: "100px",
          render: (review) => {
            return `${review.orderItem.invoice.PetOwner.firstName} ${review.orderItem.invoice.PetOwner.lastName}`;
          },
        },
        {
          accessor: "title",
          title: "Review Title",
          textAlignment: "left",
          sortable: true,
          ellipsis: true,
          width: "180px",
        },
        {
          accessor: "dateCreated",
          title: "Date Created",
          textAlignment: "left",
          sortable: true,
          width: "130px",
          render: (review) => {
            return `${dayjs(review.dateCreated).format("DD-MM-YYYY")}`;
          },
        },
        {
          accessor: "serviceListing.title",
          title: "Service Listing",
          textAlignment: "left",
          sortable: true,
          ellipsis: true,
          width: "300px",
        },
        {
          accessor: "rating",
          title: "Rating",
          textAlignment: "left",
          width: "150px",
          render: (value) => {
            return (
              <Rating
                mt={-2}
                value={Number(value.rating)}
                readOnly={true}
                emptySymbol={
                  <IconPaw
                    size="1.5rem"
                    color={theme.colors.yellow[7]}
                    strokeWidth={1.5}
                  />
                }
                fullSymbol={
                  <IconPaw
                    size="1.5rem"
                    color={theme.colors.yellow[7]}
                    fill={theme.colors.yellow[4]}
                    strokeWidth={1.5}
                  />
                }
              />
            );
          },
        },
        {
          accessor: "reportedBy.length",
          title: "No. of reports",
          textAlignment: "left",
          sortable: true,
          width: "120px",
        },
        {
          accessor: "actions",
          title: "Actions",
          textAlignment: "right",
          width: "60px",
          render: (review) => (
            <Group position="right">
              <ViewReportedReviewModal
                canWrite={canWrite}
                review={review}
                onDelete={() => {
                  onDelete(review.reviewId);
                  if (records.length === 1 && page > 1) {
                    onPageChange(page - 1);
                  }
                }}
                onResolve={() => {
                  onResolve(review.reviewId);
                  if (records.length === 1 && page > 1) {
                    onPageChange(page - 1);
                  }
                }}
              />
            </Group>
          ),
        },
      ]}
    />
  );
};

export default ReportedReviewTable;
