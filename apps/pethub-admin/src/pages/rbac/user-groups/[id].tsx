import {
  Accordion,
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
import React, { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import AddUsersToUserGroupModal from "@/components/rbac/AddUsersToUserGroupModal";
import MembershipsTable from "@/components/rbac/MembershipsTable";
import UserGroupInfoForm from "@/components/rbac/UserGroupInfoForm";
import UserGroupPermissionsForm from "@/components/rbac/UserGroupPermissionsForm";
import { useGetUserGroupById, useUpdateUserGroup } from "@/hooks/rbac";

interface UserGroupDetailsProps {
  groupId: number;
}

export default function UserGroupDetails({ groupId }: UserGroupDetailsProps) {
  const theme = useMantineTheme();
  const queryClient = useQueryClient();

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
    // to refactor after BE change the update endpoint
    const payload = isUpdatingPermissions
      ? {
          groupId: userGroup?.groupId,
          name: userGroup?.name,
          description: userGroup?.description,
          permissionIds: values.permissionIds,
        }
      : {
          groupId: userGroup?.groupId,
          name: values.name,
          description: values.description,
          permissionIds: getCurrentPermissionIds(),
        };
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
        permissionsForm.reset();
      } else {
        setIsEditingGroupInfo(false);
        groupInfoForm.reset();
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

  return (
    <Container fluid>
      <PageTitle title="User Group Details" />
      <Accordion
        multiple
        value={openedAccordions}
        onChange={(values) => handleChangeAccordion(values)}
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
          <Accordion.Panel>
            <UserGroupInfoForm
              userGroup={userGroup}
              form={groupInfoForm}
              isEditing={isEditingGroupInfo}
              onCancel={handleCancelEditGroupInfo}
              onClickEdit={() => setIsEditingGroupInfo(true)}
              onSubmit={handleUpdateUserGroup}
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
          <Accordion.Panel>
            <UserGroupPermissionsForm
              userGroup={userGroup}
              form={permissionsForm}
              isEditing={isEditingPermissions}
              onCancel={handleCancelEditPermissions}
              onClickEdit={() => setIsEditingPermissions(true)}
              onSubmit={handleUpdateUserGroup}
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="groupMemberships">
          <Accordion.Control>
            <Group>
              <IconUsersGroup color={theme.colors.indigo[5]} />
              <Text weight={600} size="xl">
                Memberships ({userGroup?.userGroupMemberships?.length})
              </Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <AddUsersToUserGroupModal />
            {userGroup?.userGroupMemberships &&
            userGroup.userGroupMemberships.length > 0 ? (
              <MembershipsTable userGroup={userGroup} />
            ) : null}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  const groupId = context.params.id;
  return { props: { groupId } };
}
