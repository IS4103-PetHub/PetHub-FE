import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconTrash, IconX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import React, { useState, useEffect } from "react";
import { useRemoveUserFromUserGroup } from "@/hooks/rbac";
import { TABLE_PAGE_SIZE } from "@/types/constants";
import { UserGroup, UserGroupMembership } from "@/types/types";
import RemoveUserFromGroupButton from "./RemoveUserFromGroupButton";

interface MembershipsTableProps {
  userGroup?: UserGroup;
  refetch(): void;
}

const MembershipsTable = ({ userGroup, refetch }: MembershipsTableProps) => {
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

  const removeUserFromGroupMutation = useRemoveUserFromUserGroup();
  const handleRemoveUser = async (id: number) => {
    const payload = { groupId: userGroup?.groupId, userId: id };
    try {
      await removeUserFromGroupMutation.mutateAsync(payload);
      notifications.show({
        title: "Member Removed",
        color: "green",
        icon: <IconCheck />,
        message:
          "The selected user have been removed from this group successfully!",
      });
      refetch();
    } catch (error: any) {
      notifications.show({
        title: "Error Removing Member",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
  };

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
          accessor: "firstName",
          width: "15vw",
          ellipsis: true,
          render: (userGroupPermission) =>
            userGroupPermission.user.internalUser.firstName,
        },
        {
          accessor: "lastName",
          width: "15vw",
          ellipsis: true,
          render: (userGroupPermission) =>
            userGroupPermission.user.internalUser.lastName,
        },
        {
          accessor: "email",
          width: "25vw",
          ellipsis: true,
          render: (userGroupPermission) => userGroupPermission.user.email,
        },
        {
          // actions
          accessor: "actions",
          title: "Actions",
          width: "10vw",
          render: (userGroupPermission) => (
            <RemoveUserFromGroupButton
              userName={`${userGroupPermission?.user?.internalUser.firstName} ${userGroupPermission?.user?.internalUser.lastName}`}
              groupName={userGroup?.name ?? "this group"}
              onDelete={() => handleRemoveUser(userGroupPermission.userId)}
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
