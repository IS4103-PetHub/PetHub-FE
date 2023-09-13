import { Button, Group } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import React, { useState } from "react";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditActionButton from "web-ui/shared/EditActionButton";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { UserGroup } from "@/types/types";

const PAGE_SIZE = 15;
interface UserGroupsTableProps {
  userGroups: UserGroup[];
  onDelete(id: number): void;
}

const UserGroupsTable = ({ userGroups, onDelete }: UserGroupsTableProps) => {
  const [page, setPage] = useState<number>(1);
  return (
    <DataTable
      minHeight={150}
      columns={[
        {
          accessor: "groupId",
          title: "#",
          textAlignment: "right",
          width: 80,
        },
        { accessor: "name", width: "25vw", ellipsis: true },
        { accessor: "description", width: "40vw", ellipsis: true },
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
      //pagination
      totalRecords={userGroups ? userGroups.length : 0}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={(p) => setPage(p)}
      idAccessor="userId"
    />
  );
};

export default UserGroupsTable;
