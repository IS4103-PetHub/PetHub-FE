import { Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { PageTitle } from "web-ui";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import CalendarGroupModal from "@/components/calendarGroup/CalendarGroupModal";

/*
 * This is a dummy page just so I can sit my modal inside only since the actual page is part of another ticket
 */

export default function CalendarGroup() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Head>
        <title>Calendar Group - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart">
          <PageTitle title="Calendar Group" />
          <LargeCreateButton text="Create Calendar Group" onClick={open} />
        </Group>

        <Group mt="xs">
          <CalendarGroupModal opened={opened} open={open} close={close} />
        </Group>
      </Container>
    </>
  );
}
