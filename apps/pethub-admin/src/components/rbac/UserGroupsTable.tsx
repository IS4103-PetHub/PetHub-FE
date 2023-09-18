import { Group } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import React from "react";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { TABLE_PAGE_SIZE } from "@/types/constants";
import { UserGroup } from "@/types/types";
interface UserGroupsTableProps {
  records: UserGroup[];
  totalNumUserGroups: number;
  page: number;
  isSearching: boolean;
  sortStatus: DataTableSortStatus;
  onDelete(id: number): void;
  onSortStatusChange: any;
  onPageChange(p: number): void;
}

const UserGroupsTable = ({
  records,
  totalNumUserGroups,
  page,
  isSearching,
  sortStatus,
  onDelete,
  onSortStatusChange,
  onPageChange,
}: UserGroupsTableProps) => {
  const router = useRouter();

  return (
    <DataTable
      minHeight={150}
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
              <DeleteActionButtonModal
                title={`Are you sure you want to delete ${group.name}?`}
                subtitle="Any users currently assigned to this user group will be unassigned."
                onDelete={() => onDelete(group.groupId)}
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
      //sorting
      sortStatus={sortStatus}
      onSortStatusChange={onSortStatusChange}
      //pagination
      totalRecords={isSearching ? records.length : totalNumUserGroups}
      recordsPerPage={TABLE_PAGE_SIZE}
      page={page}
      onPageChange={(p) => onPageChange(p)}
      idAccessor="userId"
    />
  );
};

export default UserGroupsTable;
