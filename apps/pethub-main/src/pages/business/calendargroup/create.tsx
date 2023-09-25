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
import React, { useState, useEffect } from "react";
import { PageTitle } from "web-ui";
import CalendarGroupForm from "@/components/calendarGroup/CalendarGroupForm";
import { RecurrencePatternEnum } from "@/types/constants";
import { validateCalendarGroupSettings } from "@/util";

export default function CreateCalendarGroup() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      scheduleSettings: [
        {
          scheduleSettingsId: Date.now(), // Using current timestamp as a temporary ID for uniqueness.
          days: [],
          startTime: "",
          endTime: "",
          vacancies: 0,
          pattern: RecurrencePatternEnum.Daily,
          startDate: "",
          endDate: "",
          timeslots: [
            {
              timeslotId: Date.now(), // default timeslot
              startTime: "",
              endTime: "",
            },
          ],
        },
      ],
    },
    validate: {
      name: (value) =>
        !value || value.length >= 32
          ? "Name is required and should be at most 32 characters long."
          : null,
      description: (value) => (!value ? "Description is required." : null),
      scheduleSettings: (value) => validateCalendarGroupSettings(value),
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
          <CalendarGroupForm form={form} />
        </Group>
      </Container>
    </>
  );
}
