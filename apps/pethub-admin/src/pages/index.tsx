import { Container, Tabs } from "@mantine/core";
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";
import Head from "next/head";
import { useState } from "react";
import { PageTitle } from "web-ui";
import PetBusinessTab from "@/components/tabs/accounttabs/PetBusinessTab";
import PetOwnerTab from "@/components/tabs/accounttabs/PetOwnerTab";
import AdministratorTab from "@/components/users/AdminTable";

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
        </Container>
      </main>
    </>
  );
}
