import { Group } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import React from "react";
import { getMinTableHeight } from "shared-utils";
import { TABLE_PAGE_SIZE } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { UserGroup } from "@/types/types";
interface UserGroupsTableProps {
  records: UserGroup[];
  totalNumUserGroups: number;
  page: number;
  sortStatus: DataTableSortStatus;
  onDelete(id: number): void;
  onSortStatusChange: any;
  onPageChange(p: number): void;
  disabled?: boolean;
}

const UserGroupsTable = ({
  records,
  totalNumUserGroups,
  page,
  sortStatus,
  onDelete,
  onSortStatusChange,
  onPageChange,
  disabled,
}: UserGroupsTableProps) => {
  const router = useRouter();

  return (
    <DataTable
      highlightOnHover
      onRowClick={(record) =>
        router.push(`/admin/rbac/user-groups/${record.groupId}`)
      }
      minHeight={getMinTableHeight(records)}
      columns={[
        {
          accessor: "groupId",
          title: "#",
          textAlignment: "right",
          width: 80,
          sortable: true,
        },
        { accessor: "name", width: "20vw", ellipsis: true, sortable: true },
        {
          accessor: "description",
          width: "35vw",
          ellipsis: true,
          sortable: true,
          render: ({ description }) => (description ? description : "-"),
        },
        {
          // actions
          accessor: "actions",
          title: "Actions",
          width: 100,
          textAlignment: "right",
          render: (group) => (
            <Group position="right">
              <ViewActionButton
                onClick={() =>
                  router.push(`${router.asPath}/user-groups/${group.groupId}`)
                }
              />
              {!disabled && (
                <DeleteActionButtonModal
                  title={`Are you sure you want to delete ${group.name}?`}
                  subtitle="Any users currently assigned to this user group will be unassigned."
                  onDelete={() => {
                    onDelete(group.groupId);
                    // Check if there is only 1 record on this page and we're not on the first page.
                    if (records.length === 1 && page > 1) {
                      onPageChange(page - 1);
                    }
                  }}
                />
              )}
            </Group>
          ),
        },
      ]}
      records={records}
      withBorder
      withColumnBorders
      striped
      verticalSpacing="sm"
      //sorting
      sortStatus={sortStatus}
      onSortStatusChange={onSortStatusChange}
      //pagination
      totalRecords={totalNumUserGroups}
      recordsPerPage={TABLE_PAGE_SIZE}
      page={page}
      onPageChange={(p) => onPageChange(p)}
      idAccessor="userId"
    />
  );
};

export default UserGroupsTable;
