import { DataTable } from "mantine-datatable";
import React from "react";
import { UserGroup } from "@/types/types";

interface UserGroupsTableProps {
  userGroups: UserGroup[];
}
const UserGroupsTable = ({ userGroups }: UserGroupsTableProps) => {
  return (
    <DataTable
      columns={[
        {
          accessor: "index",
          title: "#",
          render: (group) => group.groupId,
          textAlignment: "right",
          width: 50,
        },
        { accessor: "name", width: "25vw" },
        { accessor: "description", width: "40vw", ellipsis: true },
        {
          accessor: "permissions",
          render: (group) => group.permissions.length,
        },
      ]}
      records={userGroups}
      withBorder
      withColumnBorders
      striped
      verticalSpacing="sm"
    />
  );
};

export default UserGroupsTable;
