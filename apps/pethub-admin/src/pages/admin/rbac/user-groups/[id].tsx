import {
  Accordion,
  Badge,
  Container,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconClipboardText,
  IconLockOpen,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import AddUsersToUserGroupModal from "@/components/rbac/AddUsersToUserGroupModal";
import MembershipsTable from "@/components/rbac/MembershipsTable";
import UserGroupInfoForm from "@/components/rbac/UserGroupInfoForm";
import UserGroupPermissionsForm from "@/components/rbac/UserGroupPermissionsForm";
import {
  useDeleteUserGroup,
  useGetUserGroupById,
  useUpdateUserGroup,
} from "@/hooks/rbac";
import { PermissionsCodeEnum } from "@/types/constants";
import { Permission } from "@/types/types";

interface UserGroupDetailsProps {
  groupId: number;
  permissions: Permission[];
}

export default function UserGroupDetails({
  groupId,
  permissions,
}: UserGroupDetailsProps) {
  const theme = useMantineTheme();
  const queryClient = useQueryClient();
  const router = useRouter();

  //permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(PermissionsCodeEnum.WriteRbac);
  const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadRbac);

  const [isEditingGroupInfo, setIsEditingGroupInfo] = useToggle();
  const [isEditingPermissions, setIsEditingPermissions] = useToggle();
  const [openedAccordions, setOpenedAccordions] = useState<string[]>([
    "groupInfo",
    "groupPermissions",
    "groupMemberships",
  ]);

  const { data: userGroup, refetch } = useGetUserGroupById(groupId);
  // group info form
  const groupInfoForm = useForm({
    initialValues: {
      name: userGroup?.name ?? "",
      description: userGroup?.description ?? "",
    },
  });

  // permissions form
  function getCurrentPermissionIds() {
    return (
      userGroup?.userGroupPermissions?.map(
        (userGroupPermission) => userGroupPermission.permissionId,
      ) ?? []
    );
  }

  const permissionsForm = useForm({
    initialValues: {
      permissionIds: getCurrentPermissionIds(),
    },
  });

  useEffect(() => {
    // update form values from fetched object
    groupInfoForm.setValues({
      name: userGroup?.name ?? "",
      description: userGroup?.description ?? "",
    });
    permissionsForm.setFieldValue("permissionIds", getCurrentPermissionIds());
  }, [userGroup]);

  const handleChangeAccordion = (values: string[]) => {
    // prevent user from closing an accordion when updating
    if (!values.includes("groupInfo") && isEditingGroupInfo) {
      return;
    }
    if (!values.includes("groupPermissions") && isEditingPermissions) {
      return;
    }
    setOpenedAccordions(values);
  };

  const handleCancelEditGroupInfo = () => {
    setIsEditingGroupInfo(false);
    groupInfoForm.setValues({
      name: userGroup?.name ?? "",
      description: userGroup?.description ?? "",
    });
  };

  const handleCancelEditPermissions = () => {
    setIsEditingPermissions(false);
    permissionsForm.setFieldValue("permissionIds", getCurrentPermissionIds());
  };

  const updateUserGroupMutation = useUpdateUserGroup(queryClient);

  const handleUpdateUserGroup = async (values: any) => {
    const isUpdatingPermissions = Object.keys(values).includes("permissionIds");
    const payload = { groupId: userGroup?.groupId, ...values };

    try {
      await updateUserGroupMutation.mutateAsync(payload);
      notifications.show({
        title: "User Group Updated",
        color: "green",
        icon: <IconCheck />,
        message: isUpdatingPermissions
          ? "User group permissions updated successfully!"
          : "User group info updated successfully!",
      });
      refetch();

      if (isUpdatingPermissions) {
        setIsEditingPermissions(false);
      } else {
        setIsEditingGroupInfo(false);
      }
    } catch (error: any) {
      notifications.show({
        title: "Error Updating User Group",
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

  const deleteUserGroupMutation = useDeleteUserGroup(queryClient);
  const handleDeleteUserGroup = async (id?: number) => {
    if (!id) return;
    try {
      await deleteUserGroupMutation.mutateAsync(id);
      // redirect back to user groups table
      router.push("/rbac");
      notifications.show({
        title: "User Group Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `User group ID: ${id} deleted successfully.`,
      });
    } catch (error: any) {
      notifications.show({
        title: "Error Deleting User Group",
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

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  return (
    <>
      <Head>
        <title>User Group Details - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart">
          <Group position="left">
            <PageTitle title="User Group Details" />
            <Badge size="lg">Group Id: {groupId}</Badge>
          </Group>
          {canWrite ? (
            <DeleteActionButtonModal
              title={`Are you sure you want to delete ${userGroup?.name}?`}
              subtitle="Any users currently assigned to this user group will be unassigned."
              onDelete={() => handleDeleteUserGroup(userGroup?.groupId)}
              large
            />
          ) : null}
        </Group>

        <Accordion
          multiple
          value={openedAccordions}
          onChange={(values) => handleChangeAccordion(values)}
          mb="xl"
        >
          <Accordion.Item value="groupInfo">
            <Accordion.Control>
              <Group>
                <IconClipboardText color={theme.colors.indigo[5]} />
                <Text weight={600} size="xl">
                  Information
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel mb="xs">
              <UserGroupInfoForm
                userGroup={userGroup}
                form={groupInfoForm}
                isEditing={isEditingGroupInfo}
                onCancel={handleCancelEditGroupInfo}
                onClickEdit={() => setIsEditingGroupInfo(true)}
                onSubmit={handleUpdateUserGroup}
                disabled={!canWrite}
              />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="groupPermissions">
            <Accordion.Control>
              <Group>
                <IconLockOpen color={theme.colors.indigo[5]} />
                <Text weight={600} size="xl">
                  Permissions (
                  {isEditingPermissions
                    ? permissionsForm.values.permissionIds.length
                    : getCurrentPermissionIds().length}
                  )
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel mb="xs">
              <UserGroupPermissionsForm
                userGroup={userGroup}
                form={permissionsForm}
                isEditing={isEditingPermissions}
                onCancel={handleCancelEditPermissions}
                onClickEdit={() => setIsEditingPermissions(true)}
                onSubmit={handleUpdateUserGroup}
                disabled={!canWrite}
              />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="groupMemberships">
            <Accordion.Control>
              <Group>
                <IconUsersGroup color={theme.colors.indigo[5]} />
                <Text weight={600} size="xl">
                  Members ({userGroup?.userGroupMemberships?.length})
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel mb="xs">
              {canWrite ? (
                <AddUsersToUserGroupModal
                  userGroup={userGroup}
                  refetch={refetch}
                />
              ) : null}
              {userGroup?.userGroupMemberships &&
              userGroup.userGroupMemberships.length > 0 ? (
                <MembershipsTable
                  userGroup={userGroup}
                  refetch={refetch}
                  disabled={!canWrite}
                />
              ) : null}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
    </>
  );
}
export async function getServerSideProps(context) {
  const groupId = context.params.id;
  const session = await getSession(context);
  if (!session) return { props: { groupId } };

  const userId = session.user["userId"];
  const permissions = await (
    await axios.get(
      `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/rbac/users/${userId}/permissions`,
    )
  ).data;
  return { props: { groupId, permissions } };
}
