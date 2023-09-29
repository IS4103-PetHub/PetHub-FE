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
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { RecurrencePatternEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import LargeEditButton from "web-ui/shared/LargeEditButton";
import CalendarGroupForm from "@/components/calendarGroup/CalendarGroupForm";
import { useGetCalendarGroupById } from "@/hooks/calendar-group";
import { useUpdateCalendarGroup } from "@/hooks/calendar-group";
import { CalendarGroup, ScheduleSettings, TimePeriod } from "@/types/types";
import { validateCGSettings } from "@/util";

interface ViewCalendarGroupProps {
  userId: number;
}

export default function ViewCalendarGroup({ userId }: ViewCalendarGroupProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditingDisabled, setIsEditingDisabled] = useState(true);
  const [key, setKey] = useState(Math.random());
  const [initialValues, setInitialValues] = useState<CalendarGroup>({
    calendarGroupId: null,
    name: "",
    description: "",
    scheduleSettings: null,
  });

  const calendarGroupId = Number(router.query.id);

  const { data: calendarGroup, refetch: refetchCalendarGroup } =
    useGetCalendarGroupById(calendarGroupId);

  const form = useForm({
    initialValues: {
      calendarGroupId: calendarGroup?.calendarGroupId,
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
      const values = {
        calendarGroupId: calendarGroup.calendarGroupId,
        name: calendarGroup.name,
        description: calendarGroup.description,
        scheduleSettings: calendarGroup.scheduleSettings,
      };
      form.setValues(values);
      setInitialValues(values);
    }
  }, [calendarGroup]);

  function toggleEdit() {
    setIsEditingDisabled(!isEditingDisabled);
  }

  function cancelEdit() {
    form.setValues(initialValues);
    setKey(Math.random()); // Force CalendarGroupForm to re-render with initialValues upon cancel
  }

  const updateCalendarGroupMutation = useUpdateCalendarGroup(queryClient);
  const updateCalendarGroup = async (payload: CalendarGroup) => {
    try {
      await updateCalendarGroupMutation.mutateAsync(payload);
      notifications.show({
        title: "Calendar group updated",
        color: "green",
        icon: <IconCheck />,
        message: `Calendar group updated successfully!`,
      });
      toggleEdit();
      refetchCalendarGroup();
    } catch (error: any) {
      notifications.show({
        title: "Error updating calendar group",
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
          <PageTitle
            title={
              isEditingDisabled
                ? "View Calendar Group"
                : "Editing Calendar Group"
            }
          />
          {isEditingDisabled && (
            <LargeEditButton text="Edit Calendar Group" onClick={toggleEdit} />
          )}
        </Group>

        <Group mt="xs">
          <CalendarGroupForm
            key={key}
            form={form}
            userId={userId}
            isEditingDisabled={isEditingDisabled}
            forView={true}
            toggleEdit={toggleEdit}
            cancelEdit={cancelEdit}
            submit={updateCalendarGroup}
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
