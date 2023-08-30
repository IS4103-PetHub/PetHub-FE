import { Container, Tabs } from "@mantine/core";
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";
import Head from "next/head";
import { useState } from "react";
import { PageTitle } from "web-ui";
import AdministratorTab from "@/components/tabs/AdministratorTab";
import PetBusinessTab from "@/components/tabs/PetBusinessTab";
import PetOwnerTab from "@/components/tabs/PetOwnerTab";

function Demo() {
  return (
    <Tabs defaultValue="petOwner">
      <Tabs.List>
        <Tabs.Tab value="petOwner" icon={<IconPhoto size="0.8rem" />}>
          Pet Owner
        </Tabs.Tab>
        <Tabs.Tab
          value="petBusiness"
          icon={<IconMessageCircle size="0.8rem" />}
        >
          Pet Business
        </Tabs.Tab>
        <Tabs.Tab value="administrator" icon={<IconSettings size="0.8rem" />}>
          Administrator
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="petOwner" pt="xs">
        <PetOwnerTab />
      </Tabs.Panel>

      <Tabs.Panel value="petBusiness" pt="xs">
        <PetBusinessTab />
      </Tabs.Panel>

      <Tabs.Panel value="administrator" pt="xs">
        <AdministratorTab />
      </Tabs.Panel>
    </Tabs>
  );
}

export default function Home() {
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
          <PageTitle title="Welcome" />
          <Demo />
        </Container>
      </main>
    </>
  );
}
