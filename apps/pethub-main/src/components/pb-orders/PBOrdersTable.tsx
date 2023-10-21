import { ActionIcon, Badge, Group, useMantineTheme } from "@mantine/core";
import { IconFileDownload } from "@tabler/icons-react";
import dayjs from "dayjs";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  OrderItem,
  TABLE_PAGE_SIZE,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getMinTableHeight,
} from "shared-utils";
import ViewActionButton from "web-ui/shared/ViewActionButton";

interface PBOrdersTableProps {
  records: OrderItem[];
  page: number;
  sortStatus: DataTableSortStatus;
  onSortStatusChange: any;
  onPageChange(p: number): void;
  totalNumRecords: number;
}

const PBOrdersTable = ({
  records,
  page,
  sortStatus,
  onSortStatusChange,
  onPageChange,
  totalNumRecords,
}: PBOrdersTableProps) => {
  const router = useRouter();
  const theme = useMantineTheme();

  const orderStatusColorMap = new Map([
    ["PENDING_BOOKING", "indigo"],
    ["PENDING_FULFILLMENT", "violet"],
    ["FULFILLED", "green"],
    ["PAID_OUT", "green"],
    ["REFUNDED", "orange"],
    ["EXPIRED", "red"],
  ]);

  return (
    <>
      <DataTable
        minHeight={getMinTableHeight(records)}
        records={records}
        columns={[
          {
            accessor: "orderItemId",
            title: "ID",
            textAlignment: "left",
            sortable: true,
          },
          // item name
          {
            accessor: "itemName",
            title: "Name",
            textAlignment: "left",
            sortable: true,
          },
          {
            accessor: "itemPrice",
            title: "Price ($)",
            textAlignment: "right",
            render: (record) => {
              return `${formatNumber2Decimals(record.itemPrice)}`;
            },
            sortable: true,
          },
          {
            accessor: "createdAt",
            title: "Date Created",
            textAlignment: "left",
            render: (record) => {
              return record.invoice
                ? dayjs(record.invoice.createdAt).format("DD-MM-YYYY")
                : "-";
            },
            sortable: true,
          },
          {
            accessor: "bookingDate",
            title: "Appointment Date",
            textAlignment: "left",
            render: (record) => {
              return record.booking
                ? dayjs(record.booking.startTime).format("DD-MM-YYYY")
                : "-";
            },
            sortable: true,
          },
          // status
          {
            accessor: "status",
            title: "Status",
            textAlignment: "left",
            render: (record) => {
              return (
                <Badge color={orderStatusColorMap.get(record.status)}>
                  {record.status}
                </Badge>
              );
            },
          },
          {
            accessor: "actions",
            title: "Actions",
            textAlignment: "right",
            render: (order) => (
              <Group position="right">
                <ViewActionButton
                  onClick={function (): void {
                    router.push(`${router.asPath}/${order.orderItemId}`);
                  }}
                />
                <ActionIcon
                  size="lg"
                  radius="md"
                  color={theme.primaryColor}
                  variant={theme.colorScheme === "light" ? "outline" : "light"}
                  sx={{ border: "1.5px solid" }}
                  onClick={function (): void {
                    window.open(order.attachmentURL, "_blank");
                  }}
                >
                  <IconFileDownload size={"1.25rem"} />
                </ActionIcon>
                {/* not sure if need a download invocie button */}
              </Group>
            ),
          },
        ]}
        withBorder
        withColumnBorders
        striped
        verticalSpacing="sm"
        idAccessor="orderItemId"
        //sorting
        sortStatus={sortStatus}
        onSortStatusChange={onSortStatusChange}
        //pagination
        totalRecords={totalNumRecords}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
      />
    </>
  );
};

export default PBOrdersTable;
