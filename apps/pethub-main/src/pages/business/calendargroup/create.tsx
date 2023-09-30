import { Container, Group } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { RecurrencePatternEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import CalendarGroupForm from "@/components/calendarGroup/CalendarGroupForm";
import { useCreateCalendarGroup } from "@/hooks/calendar-group";
import { CalendarGroup, ScheduleSettings, TimePeriod } from "@/types/types";
import {
  validateCGDescription,
  validateCGName,
  validateCGSettings,
} from "@/util";

interface CreateCalendarGroupProps {
  userId: number;
}

export default function CreateCalendarGroup({
  userId,
}: CreateCalendarGroupProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

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
                startTime: "00:00",
                endTime: "00:00",
                vacancies: 1,
              },
            ],
          },
        },
      ],
    },
    validate: {
      name: validateCGName,
      description: validateCGDescription,
      scheduleSettings: validateCGSettings as any,
    },
  });

  const createCalendarGroupMutation = useCreateCalendarGroup(queryClient);
  const createCalendarGroup = async (payload: CalendarGroup) => {
    try {
      await createCalendarGroupMutation.mutateAsync(payload);
      notifications.show({
        title: "Calendar group created",
        color: "green",
        icon: <IconCheck />,
        message: `Calendar group created successfully!`,
      });
      router.push("/business/calendargroup");
    } catch (error: any) {
      notifications.show({
        title: "Error creating calendar group",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Create Calendar Group - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt="xl" mb="xl">
        <Group position="apart">
          <PageTitle title="Create Calendar Group" />
          <LargeBackButton
            text="Back to Calendar View"
            onClick={() => router.push("/business/calendargroup")}
          />
        </Group>

        <Group mt="xs">
          <CalendarGroupForm
            form={form}
            userId={userId}
            forView={false}
            isEditingDisabled={false}
            submit={createCalendarGroup}
          />
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
