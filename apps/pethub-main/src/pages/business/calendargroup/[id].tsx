import {
  Box,
  Badge,
  Modal,
  Textarea,
  Button,
  Grid,
  Text,
  Center,
  Title,
  Switch,
  Container,
  Group,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { RecurrencePatternEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import CalendarGroupForm from "@/components/calendarGroup/CalendarGroupForm";
import { useGetCalendarGroupById } from "@/hooks/calendar-group";
import { validateCGSettings } from "@/util";

interface ViewCalendarGroupProps {
  userId: number;
}

export default function ViewCalendarGroup({ userId }: ViewCalendarGroupProps) {
  const router = useRouter();

  const calendarGroupId = Number(router.query.id);

  const { data: calendarGroup, refetch: refetchCalendarGroup } =
    useGetCalendarGroupById(calendarGroupId);

  const form = useForm({
    initialValues: {
      name: calendarGroup?.name,
      description: calendarGroup?.description,
      scheduleSettings: calendarGroup?.scheduleSettings,
    },
    validate: {
      name: (value) =>
        !value || value.length >= 32
          ? "Name is required and should be at most 32 characters long."
          : null,
      description: (value) => (!value ? "Description is required." : null),
      scheduleSettings: (value) => validateCGSettings(value) as any,
    },
  });

  useEffect(() => {
    if (calendarGroup) {
      form.setValues({
        name: calendarGroup.name,
        description: calendarGroup.description,
        scheduleSettings: calendarGroup.scheduleSettings,
      });
    }
  }, [calendarGroup]);

  if (!calendarGroupId) {
    return null;
  }

  return (
    <>
      <Head>
        <title>View Calendar Group - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt="xl" mb="xl">
        <Group position="apart">
          <PageTitle title="View Calendar Group" />
        </Group>

        <Group mt="xs">
          <CalendarGroupForm form={form} userId={userId} />
        </Group>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return null;

  const userId = session.user["userId"];

  return { props: { userId } };
}
