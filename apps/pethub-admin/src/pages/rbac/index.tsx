import { Container, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import UserGroupsTable from "@/components/rbac/UserGroupsTable";
import {
  useCreateUserGroup,
  useDeleteUserGroup,
  useGetAllUserGroups,
} from "@/hooks/rbac";
import { CreateUserGroupPayload } from "@/types/types";

export default function RBAC() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userGroups = [], isLoading, refetch } = useGetAllUserGroups();

  const deleteUserGroupMutation = useDeleteUserGroup(queryClient);

  const handleDeleteUserGroup = async (id: number) => {
    try {
      await deleteUserGroupMutation.mutateAsync(id);
      notifications.show({
        title: "User Group Deleted",
        color: "green",
        icon: <IconCheck />,
        message: "User group deleted successfully.",
      });
      // refetch();
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

  return (
    <Container fluid>
      <Group position="apart" mb="xl">
        <PageTitle title="Role-based Access Control" />
        <LargeCreateButton
          text="Create User Group"
          onClick={() => router.push(`${router.asPath}/create`)}
        />
      </Group>

      {userGroups.length > 0 ? (
        <UserGroupsTable
          userGroups={userGroups}
          onDelete={handleDeleteUserGroup}
        />
      ) : isLoading ? (
        // still fetching
        <CenterLoader />
      ) : (
        // no user groups fetched
        <SadDimmedMessage
          title="No user groups found"
          subtitle="Click 'Create User Group' to create a new group"
        />
      )}
    </Container>
  );
}
