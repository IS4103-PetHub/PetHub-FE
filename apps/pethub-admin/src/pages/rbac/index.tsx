import { Button, Container, Group, Loader } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useRouter } from "next/router";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import UserGroupsTable from "@/components/rbac/UserGroupsTable";
import { useGetAllUserGroups } from "@/hooks/rbac";
import { UserGroup } from "@/types/types";

// const userGroups: UserGroup[] = [
//   {
//     groupId: 1,
//     name: "Root Administrators",
//     description:
//       "Group with all permissions,Group with all permissions,Group with all permissionsGroupGroup with all permissionsGroup with all permissionswith all permissions Group with all permissions",
//     permissions: [],
//   },
//   {
//     groupId: 2,
//     name: "Root Administrators 2 ",
//     description: "Group with all permissions",
//     permissions: [],
//   },
//   {
//     groupId: 3,
//     name: "Root Administrators 3",
//     description: "Group with all permissions",
//     permissions: [],
//   },
// ];

export default function RBAC() {
  const router = useRouter();
  const { data: userGroups = [], isLoading } = useGetAllUserGroups();

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
        <UserGroupsTable userGroups={userGroups} />
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
