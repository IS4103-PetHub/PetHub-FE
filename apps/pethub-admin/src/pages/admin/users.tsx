import { Container, Tabs } from "@mantine/core";
import { IconPaw, IconBuildingStore, IconUserCog } from "@tabler/icons-react";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { PageTitle } from "web-ui";
import api from "@/api/axiosConfig";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import InternalUserTable from "@/components/users/InternalUserTable";
import PetBusinessTable from "@/components/users/PetBusinessTable";
import PetOwnerTable from "@/components/users/PetOwnerTable";
import { AccountTypeEnum, PermissionsCodeEnum } from "@/types/constants";
import { Permission } from "@/types/types";

interface AccountTabsProps {
  sessionUserId: number;
  canWriteInternalUsers: boolean;
  canReadInternalUsers: boolean;
  canWritePetOwners: boolean;
  canReadPetOwners: boolean;
  canWritePetBusinesses: boolean;
  canReadPetBusinesses: boolean;
}

function AccountTabs({
  sessionUserId,
  canWriteInternalUsers,
  canReadInternalUsers,
  canWritePetBusinesses,
  canWritePetOwners,
  canReadPetBusinesses,
  canReadPetOwners,
}: AccountTabsProps) {
  function getDefaultTab() {
    if (canReadInternalUsers) {
      return AccountTypeEnum.InternalUser;
    }
    if (canReadPetBusinesses) {
      return AccountTypeEnum.PetBusiness;
    }
    return AccountTypeEnum.PetOwner;
  }
  return (
    <Tabs defaultValue={getDefaultTab()} mt="md">
      <Tabs.List>
        {canReadInternalUsers ? (
          <Tabs.Tab
            value={AccountTypeEnum.InternalUser}
            icon={<IconUserCog size="1rem" color="gray" />}
          >
            Internal User
          </Tabs.Tab>
        ) : null}

        {canReadPetBusinesses ? (
          <Tabs.Tab
            value={AccountTypeEnum.PetBusiness}
            icon={<IconBuildingStore size="1rem" color="gray" />}
          >
            Pet Business
          </Tabs.Tab>
        ) : null}

        {canReadPetOwners ? (
          <Tabs.Tab
            value={AccountTypeEnum.PetOwner}
            icon={<IconPaw size="1rem" color="gray" />}
          >
            Pet Owner
          </Tabs.Tab>
        ) : null}
      </Tabs.List>

      {canReadInternalUsers ? (
        <Tabs.Panel value={AccountTypeEnum.InternalUser} pt="xs">
          <InternalUserTable
            sessionUserId={sessionUserId}
            disabled={!canWriteInternalUsers}
          />
        </Tabs.Panel>
      ) : null}

      {canReadPetBusinesses ? (
        <Tabs.Panel value={AccountTypeEnum.PetBusiness} pt="xs">
          <PetBusinessTable />
        </Tabs.Panel>
      ) : null}

      {canReadPetOwners ? (
        <Tabs.Panel value={AccountTypeEnum.PetOwner} pt="xs">
          <PetOwnerTable />
        </Tabs.Panel>
      ) : null}
    </Tabs>
  );
}

interface UsersManagementProps {
  userId: number;
  permissions: Permission[];
}

export default function UsersManagement({
  userId,
  permissions,
}: UsersManagementProps) {
  //permissions
  const permissionCodes = permissions.map((permission) => permission.code);

  const canWriteInternalUsers = permissionCodes.includes(
    PermissionsCodeEnum.WriteInternalUsers,
  );
  const canReadInternalUsers = permissionCodes.includes(
    PermissionsCodeEnum.ReadInternalUsers,
  );
  const canWritePetOwners = permissionCodes.includes(
    PermissionsCodeEnum.WritePetOwners,
  );
  const canReadPetOwners = permissionCodes.includes(
    PermissionsCodeEnum.ReadPetOwners,
  );
  const canWritePetBusinesses = permissionCodes.includes(
    PermissionsCodeEnum.WritePetBusinesses,
  );
  const canReadPetBusinesses = permissionCodes.includes(
    PermissionsCodeEnum.ReadPetBusinesses,
  );

  if (!canReadInternalUsers && !canReadPetOwners && !canReadPetBusinesses) {
    return <NoPermissionsMessage />;
  }

  return (
    <>
      <Head>
        <title>Users - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container fluid>
          <PageTitle title="Users Management" />
          <AccountTabs
            sessionUserId={userId}
            canWriteInternalUsers={canWriteInternalUsers}
            canReadInternalUsers={canReadInternalUsers}
            canWritePetOwners={canWritePetOwners}
            canReadPetOwners={canReadPetOwners}
            canWritePetBusinesses={canWritePetBusinesses}
            canReadPetBusinesses={canReadPetBusinesses}
          />
        </Container>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const permissions = await (
    await api.get(
      `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/rbac/users/${userId}/permissions`,
    )
  ).data;
  return { props: { userId, permissions } };
}
