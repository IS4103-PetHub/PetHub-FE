import { Badge, Group } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import {
  SupportTicket,
  SupportTicketReason,
  SupportTicketStatus,
  TABLE_PAGE_SIZE,
  formatStringToLetterCase,
  getMinTableHeight,
} from "shared-utils";
import ViewActionButton from "web-ui/shared/ViewActionButton";

interface PBSupportTableProps {
  records: SupportTicket[];
  totalNumSupportTicket: number;
  refetch(): void;
  page: number;
  sortStatus: DataTableSortStatus;
  onSortStatusChange: any;
  onPageChange(p: number): void;
  router: any;
}

export default function PBSupportTable({
  records,
  totalNumSupportTicket,
  refetch,
  page,
  sortStatus,
  onSortStatusChange,
  onPageChange,
  router,
}: PBSupportTableProps) {
  const statusColorMap = new Map([
    [SupportTicketStatus.Pending, "orange"],
    [SupportTicketStatus.InProgress, "orange"],
    [SupportTicketStatus.ClosedResolved, "green"],
    [SupportTicketStatus.ClosedUnresolved, "red"],
  ]);

  const categoryColorMap = new Map([
    [SupportTicketReason.GeneralEnquiry, "blue"],
    [SupportTicketReason.ServiceListing, "cyan"],
    [SupportTicketReason.Orders, "grape"],
    [SupportTicketReason.Appointments, "green"],
    [SupportTicketReason.Payments, "indigo"],
    [SupportTicketReason.Refunds, "orange"],
    [SupportTicketReason.Accounts, "lime"],
    [SupportTicketReason.Others, "gray"],
  ]);

  return (
    <>
      <DataTable
        minHeight={getMinTableHeight(records)}
        columns={[
          {
            accessor: "supportTicketId",
            title: "Id",
            textAlignment: "left",
            width: "3vw",
            sortable: true,
            ellipsis: true,
          },
          {
            accessor: "reason",
            title: "Description",
            textAlignment: "left",
            width: "15vw",
            sortable: true,
            ellipsis: true,
          },
          {
            accessor: "supportCategory",
            title: "Category",
            textAlignment: "left",
            width: "10vw",
            sortable: true,
            ellipsis: true,
            render: (support) => (
              <Badge
                color={
                  categoryColorMap.has(support?.supportCategory)
                    ? categoryColorMap.get(support.supportCategory)
                    : "gray"
                }
              >
                {formatStringToLetterCase(support.supportCategory)}
              </Badge>
            ),
          },
          {
            accessor: "status",
            title: "Status",
            textAlignment: "left",
            width: "10vw",
            sortable: true,
            ellipsis: true,
            render: (support) => (
              <Badge
                color={
                  statusColorMap.has(support?.status)
                    ? statusColorMap.get(support.status)
                    : "gray"
                }
              >
                {formatStringToLetterCase(support.status)}
              </Badge>
            ),
          },
          {
            accessor: "actions",
            title: "Actions",
            textAlignment: "right",
            width: "5vw",
            render: (supportTicket: SupportTicket) => (
              <Group position="right">
                <ViewActionButton
                  onClick={function (): void {
                    router.push(
                      `${router.asPath}/${supportTicket.supportTicketId}`,
                    );
                  }}
                />
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
        idAccessor="supportTicketId"
        //sorting
        sortStatus={sortStatus}
        onSortStatusChange={onSortStatusChange}
        //pagination
        totalRecords={totalNumSupportTicket}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
      />
    </>
  );
}
