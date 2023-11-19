import { Badge, Group } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import {
  Priority,
  SupportTicket,
  SupportTicketReason,
  SupportTicketStatus,
  TABLE_PAGE_SIZE,
  formatISODateTimeShort,
  formatStringToLetterCase,
  getMinTableHeight,
} from "shared-utils";
import ViewActionButton from "web-ui/shared/ViewActionButton";

interface AdminSupportTableProps {
  records: SupportTicket[];
  totalNumSupportTicket: number;
  refetch(): void;
  page: number;
  sortStatus: DataTableSortStatus;
  onSortStatusChange: any;
  onPageChange(p: number): void;
  router: any;
}

export default function AdminSupportTable({
  records,
  totalNumSupportTicket,
  refetch,
  page,
  sortStatus,
  onSortStatusChange,
  onPageChange,
  router,
}: AdminSupportTableProps) {
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

  const priorityColorMap = new Map([
    [Priority.High, "red"],
    [Priority.Medium, "orange"],
    [Priority.Low, "green"],
  ]);

  return (
    <>
      <DataTable
        minHeight={getMinTableHeight(records)}
        columns={[
          {
            accessor: "supportTicketId",
            title: "Id",
            width: "3vw",
            sortable: true,
            ellipsis: true,
          },
          {
            accessor: "supportCategory",
            title: "Category",
            width: 160,
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
            accessor: "reason",
            title: "Description",
            width: "20vw",
            sortable: true,
            ellipsis: true,
          },
          {
            accessor: "createdBy",
            title: "Created By",
            width: "10vw",
            sortable: true,
            ellipsis: true,
            render: (support) => {
              return support.petOwner
                ? `${support.petOwner.firstName} ${support.petOwner.lastName}`
                : support.petBusiness.companyName;
            },
          },
          {
            accessor: "createdAt",
            title: "Created At",
            width: 160,
            sortable: true,
            ellipsis: true,
            render: (support) => {
              return formatISODateTimeShort(support.createdAt);
            },
          },
          {
            accessor: "closedAt",
            title: "Closed At",
            width: 160,
            sortable: true,
            ellipsis: true,
            render: (support) => {
              return support.closedAt
                ? formatISODateTimeShort(support.closedAt)
                : "-";
            },
          },
          {
            accessor: "status",
            title: "Status",
            width: 160,
            sortable: true,
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
            accessor: "priority",
            title: "Priority",
            width: 100,
            sortable: true,
            render: (support) => (
              <Badge
                color={
                  priorityColorMap.has(support?.priority)
                    ? priorityColorMap.get(support.priority)
                    : "gray"
                }
              >
                {formatStringToLetterCase(support.priority)}
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
        onRowClick={(record) =>
          router.push(`${router.asPath}/${record.supportTicketId}`)
        }
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
