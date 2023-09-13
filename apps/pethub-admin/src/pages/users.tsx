import { Container, Tabs } from "@mantine/core";
import { IconPaw, IconBuildingStore, IconUserCog } from "@tabler/icons-react";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { PageTitle } from "web-ui";
import InternalUserTable from "@/components/users/InternalUserTable";
import PetBusinessTable from "@/components/users/PetBusinessTable";
import PetOwnerTable from "@/components/users/PetOwnerTable";
import { AccountTypeEnum } from "@/types/constants";

function AccountTabs() {
  return (
    <Tabs defaultValue={AccountTypeEnum.PetOwner}>
      <Tabs.List>
        <Tabs.Tab
          value={AccountTypeEnum.PetOwner}
          icon={<IconPaw size="0.8rem" />}
        >
          Pet Owner
        </Tabs.Tab>
        <Tabs.Tab
          value={AccountTypeEnum.PetBusiness}
          icon={<IconBuildingStore size="0.8rem" />}
        >
          Pet Business
        </Tabs.Tab>
        <Tabs.Tab
          value={AccountTypeEnum.InternalUser}
          icon={<IconUserCog size="0.8rem" />}
        >
          Internal User
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value={AccountTypeEnum.PetOwner} pt="xs">
        <PetOwnerTable />
      </Tabs.Panel>

      <Tabs.Panel value={AccountTypeEnum.PetBusiness} pt="xs">
        <PetBusinessTable />
      </Tabs.Panel>

      <Tabs.Panel value={AccountTypeEnum.InternalUser} pt="xs">
        <InternalUserTable />
      </Tabs.Panel>
    </Tabs>
  );
}

export default function UsersManagement() {
  return (
    <>
      <Head>
        <title>PetHub - Admin Portal</title>
        <meta name="description" content="Admin portal for PetHub" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container fluid>
          <PageTitle title="Users Management" />
          <AccountTabs />
        </Container>
      </main>
    </>
  );
}
