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
  Stack,
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
import { PageTitle } from "web-ui";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import LargeEditButton from "web-ui/shared/LargeEditButton";
import CalendarGroupForm from "@/components/calendarGroup/CalendarGroupForm";
import {
  useDeleteCalendarGroupById,
  useGetCalendarGroupById,
} from "@/hooks/calendar-group";
import { useUpdateCalendarGroup } from "@/hooks/calendar-group";
import { RecurrencePatternEnum } from "@/types/constants";
import { CalendarGroup, ScheduleSettings, TimePeriod } from "@/types/types";
import {
  validateCGDescription,
  validateCGName,
  validateCGSettings,
} from "@/util";

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
      name: validateCGName,
      description: validateCGDescription,
      scheduleSettings: validateCGSettings as any,
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
        title: "Calendar Group Updated",
        color: "green",
        icon: <IconCheck />,
        message: `Calendar group updated successfully!`,
      });
      toggleEdit();
      refetchCalendarGroup();
    } catch (error: any) {
      notifications.show({
        title: "Error Updating Calendar Group",
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

  const deleteCalendarGroupMutation = useDeleteCalendarGroupById(queryClient);
  const handleDeleteCalendarGroup = async (id: number) => {
    try {
      await deleteCalendarGroupMutation.mutateAsync(id);
      notifications.show({
        title: "Calendar Group Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `Calendar group deleted successfully.`,
      });
      window.location.href = "/business/calendargroup"; // hotfix, change this in the future
    } catch (error: any) {
      notifications.show({
        title: "Error Deleting Calendar Group",
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

  if (!calendarGroupId || !calendarGroup) {
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
                ? "Viewing Calendar Group"
                : "Editing Calendar Group"
            }
          />
          {isEditingDisabled && (
            <Center>
              <LargeEditButton
                text="Edit"
                onClick={toggleEdit}
                makeSmallerATeenyBit
                color="gray"
              />
              &nbsp;
              <DeleteActionButtonModal
                title="Delete Calendar Group"
                subtitle="Are you sure you want to delete this Calendar Group? All involved bookings will be voided and an email notification will be sent to the affected customers."
                onDelete={async () =>
                  handleDeleteCalendarGroup(form.values.calendarGroupId)
                }
                large
              />
              &nbsp;
              <LargeBackButton
                text="Back"
                onClick={() =>
                  (window.location.href = "/business/calendargroup")
                } // Change this in the future, normal route would break the calendar atm
                customSize="sm"
              />
            </Center>
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
