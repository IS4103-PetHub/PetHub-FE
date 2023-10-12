import { ActionIcon, Group, useMantineTheme } from "@mantine/core";
import { IconFileDownload } from "@tabler/icons-react";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useState } from "react";
import {
  TABLE_PAGE_SIZE,
  formatStringToLetterCase,
  getMinTableHeight,
} from "shared-utils";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { OrderItem } from "@/types/types";
import { formatPriceForDisplay } from "@/util";

interface PBOrdersTableProps {
  records: OrderItem[];
  page: number;
  isSearching: boolean;
  sortStatus: DataTableSortStatus;
  onSortStatusChange: any;
  onPageChange(p: number): void;
  totalNumRecords: number;
}

const PBOrdersTable = ({
  records,
  page,
  isSearching,
  sortStatus,
  onSortStatusChange,
  onPageChange,
  totalNumRecords,
}: PBOrdersTableProps) => {
  const theme = useMantineTheme();
  const [selectedOrder, setSelectedOrder] = useState(null);

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
          },
          // item name
          {
            accessor: "itemName",
            title: "Name",
            textAlignment: "left",
          },
          // item price
          {
            accessor: "itemPrice",
            title: "Price ($)",
            textAlignment: "right",
            render: (record) => {
              return formatPriceForDisplay(record.itemPrice);
            },
          },
          // expiryDate
          {
            accessor: "expiryDate",
            title: "Expiry Date",
            textAlignment: "left",
          },
          // status
          {
            accessor: "orderItemStatus",
            title: "Status",
            textAlignment: "left",
            render: (record) =>
              formatStringToLetterCase(record.orderItemStatus),
          },
          // actions (view details, maybe view invoice)
          {
            accessor: "actions",
            title: "Actions",
            textAlignment: "right",
            render: (order) => (
              <Group position="right">
                <ViewActionButton
                  onClick={function (): void {
                    setSelectedOrder(order);
                    console.log("OPENIGN VIEW", order.orderItemId);
                  }}
                />
                <ActionIcon
                  size="lg"
                  radius="md"
                  color={theme.primaryColor}
                  variant={theme.colorScheme === "light" ? "outline" : "light"}
                  sx={{ border: "1.5px solid" }}
                  onClick={function (): void {
                    setSelectedOrder(order);
                    console.log("DOWNLOADING INVOICE", order.orderItemId);
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
        totalRecords={isSearching ? records.length : totalNumRecords}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
      />
    </>
  );
};

export default PBOrdersTable;
