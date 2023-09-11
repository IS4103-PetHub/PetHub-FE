import { Button, Container, Group } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useRouter } from "next/router";
import { PageTitle } from "web-ui";
import CreateButton from "@/components/common/CreateButton";
import UserGroupsTable from "@/components/rbac/UserGroupsTable";
import { UserGroup } from "@/types/types";

const userGroups: UserGroup[] = [
  {
    groupId: 1,
    name: "Root Administrators",
    description:
      "Group with all permissions,Group with all permissions,Group with all permissionsGroupGroup with all permissionsGroup with all permissionswith all permissions Group with all permissions",
    permissions: [],
  },
  {
    groupId: 2,
    name: "Root Administrators 2 ",
    description: "Group with all permissions",
    permissions: [],
  },
  {
    groupId: 3,
    name: "Root Administrators 3",
    description: "Group with all permissions",
    permissions: [],
  },
];

export default function RBAC() {
  const router = useRouter();
  return (
    <Container fluid>
      <Group position="apart" mb="xl">
        <PageTitle title="Role-based Access Control" />
        <CreateButton
          text="Create User Group"
          onClick={() => router.push(`${router.asPath}/create`)}
        />
      </Group>

      <UserGroupsTable userGroups={userGroups} />
    </Container>
  );
}
