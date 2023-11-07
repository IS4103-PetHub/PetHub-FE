import { Badge, Group, ActionIcon, useMantineTheme, Text } from "@mantine/core";
import { IconFileDownload } from "@tabler/icons-react";
import dayjs from "dayjs";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import {
  RefundRequest,
  TABLE_PAGE_SIZE,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getMinTableHeight,
} from "shared-utils";

interface RefundManagementTableProps {
  records: RefundRequest[];
  page: number;
  sortStatus: DataTableSortStatus;
  onSortStatusChange: any;
  onPageChange(p: number): void;
  totalNumRecords: number;
  refetch: () => Promise<any>;
}

const RefundManagementTable = ({
  records,
  page,
  sortStatus,
  onSortStatusChange,
  onPageChange,
  totalNumRecords,
  refetch,
}: RefundManagementTableProps) => {
  const theme = useMantineTheme();

  const refundStatusColorMap = new Map([
    ["PENDING", "orange"],
    ["APPROVED", "green"],
    ["REJECTED", "red"],
  ]);

  const cols: any = [
    {
      accessor: "refundRequestId",
      title: "ID",
      sortable: true,
      width: 80,
    },
    {
      accessor: "orderItem.itemName",
      title: "Order Item Name",
      sortable: true,
      render: (record) => <Text fw={500}>{record.orderItem.itemName}</Text>,
      width: "30vw",
    },
    {
      accessor: "orderItem.itemPrice",
      title: "Price ($)",
      textAlignment: "right",
      render: (record) => {
        return `${formatNumber2Decimals(record.orderItem.itemPrice)}`;
      },
      sortable: true,
    },
    {
      accessor: "createdAt",
      title: "Date Created",
      render: (record) => {
        return record.createdAt
          ? dayjs(record.createdAt).format("DD-MM-YYYY")
          : "-";
      },
      sortable: true,
    },
    {
      accessor: "processedAt",
      title: "Date Processed",
      render: (record) => {
        return record.processedAt
          ? dayjs(record.processedAt).format("DD-MM-YYYY")
          : "-";
      },
      sortable: true,
    },
    {
      accessor: "status",
      title: "Status",
      render: (record) => {
        return (
          <Badge color={refundStatusColorMap.get(record.status)}>
            {formatStringToLetterCase(record.status)}
          </Badge>
        );
      },
    },
    {
      accessor: "actions",
      title: "View Details",
      textAlignment: "right",
      render: (order) => <Group position="right">Button here</Group>,
    },
  ];

  return (
    <>
      <DataTable
        minHeight={getMinTableHeight(records)}
        records={records}
        columns={cols}
        withBorder
        withColumnBorders
        striped
        verticalSpacing="sm"
        idAccessor="refundRequestId"
        sortStatus={sortStatus}
        onSortStatusChange={onSortStatusChange}
        totalRecords={totalNumRecords}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
      />
    </>
  );
};

export default RefundManagementTable;
