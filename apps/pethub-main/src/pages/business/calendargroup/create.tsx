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
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { RecurrencePatternEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import CalendarGroupForm from "@/components/calendarGroup/CalendarGroupForm";
import { validateCGSettings } from "@/util";

interface CreateCalendarGroupProps {
  userId: number;
}

export default function CreateCalendarGroup({
  userId,
}: CreateCalendarGroupProps) {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      // a default scheduleSettings
      scheduleSettings: [
        {
          scheduleSettingsId: Date.now(), // Using current timestamp as a temporary ID for uniqueness, same with timePeriod
          days: [],
          recurrence: {
            pattern: RecurrencePatternEnum.Daily,
            startDate: "",
            endDate: "",
            timePeriods: [
              {
                timePeriodId: Date.now(), // default timePeriod
                startTime: "",
                endTime: "",
                vacancies: 1,
              },
            ],
          },
        },
      ],
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
  return (
    <>
      <Head>
        <title>Create Calendar Group - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt="xl" mb="xl">
        <Group position="apart">
          <PageTitle title="Create Calendar Group" />
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
