import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import React, { useState, useEffect } from "react";
import { TABLE_PAGE_SIZE } from "@/types/constants";
import { UserGroup, UserGroupMembership } from "@/types/types";
import RemoveUserFromGroupButton from "./RemoveUserFromGroupButton";

interface MembershipsTableProps {
  userGroup?: UserGroup;
}

const MembershipsTable = ({ userGroup }: MembershipsTableProps) => {
  const [userGroupMemberships, setUserGroupMemberships] = useState<
    UserGroupMembership[]
  >(userGroup?.userGroupMemberships ?? []);
  const [page, setPage] = useState<number>(1);

  const from = (page - 1) * TABLE_PAGE_SIZE;
  const to = from + TABLE_PAGE_SIZE;

  useEffect(() => {
    setUserGroupMemberships(userGroup?.userGroupMemberships ?? []);
    console.log(userGroupMemberships);
  }, [userGroup]);

  useEffect(() => {
    setUserGroupMemberships(
      userGroup?.userGroupMemberships?.slice(from, to) ?? [],
    );
  }, [page, userGroup]);

  return (
    <DataTable
      minHeight={userGroupMemberships.length > 0 ? 100 : 150}
      columns={[
        {
          accessor: "userId",
          title: "User ID",
          textAlignment: "right",
          width: 80,
        },
        {
          accessor: "email",
          width: "35vw",
          ellipsis: true,
          render: (userGroupPermission) => userGroupPermission.user.email,
        },
        {
          // actions
          accessor: "",
          title: "Actions",
          width: "10vw",
          render: (userGroupPermission) => (
            <RemoveUserFromGroupButton
              userName={userGroupPermission?.user?.email}
              groupName={userGroup?.name ?? "this group"}
              onDelete={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          ),
        },
      ]}
      records={userGroupMemberships}
      withBorder
      withColumnBorders
      striped
      verticalSpacing="sm"
      //pagination
      totalRecords={userGroupMemberships ? userGroupMemberships.length : 0}
      recordsPerPage={TABLE_PAGE_SIZE}
      page={page}
      onPageChange={(p) => setPage(p)}
      idAccessor="userId"
    />
  );
};

export default MembershipsTable;
