import { Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { PageTitle } from "web-ui";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";

/*
 * This is a dummy page since the actual page is part of another ticket
 */

export default function CalendarGroup() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Calendar Group - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart">
          <PageTitle title="Calendar Group" />
          <LargeCreateButton
            text="Create Calendar Group"
            onClick={() => router.push("/business/calendargroup/create")}
          />
        </Group>
      </Container>
    </>
  );
}
