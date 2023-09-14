import { Button, Group } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditActionButton from "web-ui/shared/EditActionButton";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { useGetAllUserGroups } from "@/hooks/rbac";
import { TABLE_PAGE_SIZE } from "@/types/constants";
import { UserGroup } from "@/types/types";
interface UserGroupsTableProps {
  userGroups: UserGroup[];
  page: number;
  sortStatus: DataTableSortStatus;
  onDelete(id: number): void;
  onSortStatusChange: any;
  onPageChange(p: number): void;
}

const UserGroupsTable = ({
  userGroups,
  page,
  sortStatus,
  onDelete,
  onSortStatusChange,
  onPageChange,
}: UserGroupsTableProps) => {
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
          width: "40vw",
          ellipsis: true,
          sortable: true,
        },
        {
          // actions
          accessor: "",
          title: "Actions",
          width: "10vw",
          render: (group) => (
            <Group>
              <ViewActionButton
                onClick={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
              <EditActionButton
                onClick={function (): void {
                  throw new Error("Function not implemented.");
                }}
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
      totalRecords={userGroups ? userGroups.length : 0}
      recordsPerPage={TABLE_PAGE_SIZE}
      page={page}
      onPageChange={(p) => onPageChange(p)}
      idAccessor="userId"
    />
  );
};

export default UserGroupsTable;
