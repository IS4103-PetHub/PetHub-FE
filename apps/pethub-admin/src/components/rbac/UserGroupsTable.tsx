import { Group } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { TABLE_PAGE_SIZE } from "@/types/constants";
import { UserGroup } from "@/types/types";
interface UserGroupsTableProps {
  userGroups: UserGroup[];
  totalNumUserGroups: number;
  page: number;
  sortStatus: DataTableSortStatus;
  onDelete(id: number): void;
  onSortStatusChange: any;
  onPageChange(p: number): void;
}

const UserGroupsTable = ({
  userGroups,
  totalNumUserGroups,
  page,
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
        { accessor: "name", width: "25vw", ellipsis: true, sortable: true },
        {
          accessor: "description",
          width: "35vw",
          ellipsis: true,
          sortable: true,
          render: (group) => (group.description ? group.description : "-"),
        },
        {
          // actions
          accessor: "",
          title: "Actions",
          width: "10vw",
          render: (group) => (
            <Group>
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
      records={userGroups}
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
