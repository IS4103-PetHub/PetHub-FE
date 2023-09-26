import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import React, { useState, useEffect } from "react";
import { getMinTableHeight } from "shared-utils";
import { TABLE_PAGE_SIZE } from "shared-utils";
import { useRemoveUserFromUserGroup } from "@/hooks/rbac";
import { UserGroup, UserGroupMembership } from "@/types/types";
import RemoveUserFromGroupButton from "./RemoveUserFromGroupButton";

interface MembershipsTableProps {
  userGroup?: UserGroup;
  refetch(): void;
  disabled?: boolean;
}

const MembershipsTable = ({
  userGroup,
  refetch,
  disabled,
}: MembershipsTableProps) => {
  const [userGroupMemberships, setUserGroupMemberships] = useState<
    UserGroupMembership[]
  >(userGroup?.userGroupMemberships ?? []);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
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
        message: `User ID: ${id} have been removed from this group successfully!`,
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
      minHeight={getMinTableHeight(userGroup?.userGroupMemberships)}
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
          render: (userGroupMembership) =>
            userGroupMembership.user?.internalUser?.firstName,
        },
        {
          accessor: "lastName",
          width: "15vw",
          ellipsis: true,
          render: (userGroupMembership) =>
            userGroupMembership.user?.internalUser?.lastName,
        },
        {
          accessor: "email",
          width: "25vw",
          ellipsis: true,
          render: (userGroupMembership) => userGroupMembership.user?.email,
        },
        {
          // actions
          accessor: "actions",
          title: "Actions",
          width: "10vw",
          hidden: disabled,
          render: (userGroupMembership) => (
            <RemoveUserFromGroupButton
              userName={`${userGroupMembership?.user?.internalUser?.firstName} ${userGroupMembership?.user?.internalUser?.lastName}`}
              groupName={userGroup?.name ?? "this group"}
              onDelete={() => handleRemoveUser(userGroupMembership.userId)}
            />
          ),
        },
      ]}
      records={userGroupMemberships}
      withBorder
      withColumnBorders
      striped
      verticalSpacing="xs"
      //pagination
      totalRecords={userGroup?.userGroupMemberships?.length}
      recordsPerPage={TABLE_PAGE_SIZE}
      page={page}
      onPageChange={(p) => setPage(p)}
      idAccessor="userId"
    />
  );
};

export default MembershipsTable;
