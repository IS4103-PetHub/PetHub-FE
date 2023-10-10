import { Center, Container, Group, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { CalendarGroup, getErrorMessageProps } from "shared-utils";
import { PageTitle } from "web-ui";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import LargeEditButton from "web-ui/shared/LargeEditButton";
import CalendarGroupForm from "@/components/calendarGroup/CalendarGroupForm";
import {
  useDeleteCalendarGroupById,
  useGetCalendarGroupById,
  useGetCalendarGroupByPBId,
} from "@/hooks/calendar-group";
import { useUpdateCalendarGroup } from "@/hooks/calendar-group";
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
  const [isEditingDisabled, setIsEditingDisabled] = useState(true);
  const [key, setKey] = useState(Math.random());
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<CalendarGroup>({
    calendarGroupId: null,
    name: "",
    description: "",
    scheduleSettings: null,
  });

  const calendarGroupId = Number(router.query.id);

  const {
    data: calendarGroupByPbId = [],
    refetch: refetchCalendarGroupByPbId,
  } = useGetCalendarGroupByPBId(userId);
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

  const updateCalendarGroupMutation = useUpdateCalendarGroup();
  const handleUpdateCalendarGroup = async (payload: CalendarGroup) => {
    try {
      setIsLoading(true);
      await updateCalendarGroupMutation.mutateAsync(payload);
      setIsLoading(false);
      notifications.show({
        title: "Calendar Group Updated",
        color: "green",
        icon: <IconCheck />,
        message: `Calendar group updated successfully! For affected bookings (if any), email notifications have been sent to the customers.`,
      });
      toggleEdit();
      refetchCalendarGroup();
    } catch (error: any) {
      setIsLoading(false);
      notifications.show({
        ...getErrorMessageProps("Error Updating Calendar Group", error),
      });
    }
  };

  const deleteCalendarGroupMutation = useDeleteCalendarGroupById();
  const handleDeleteCalendarGroup = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteCalendarGroupMutation.mutateAsync(id);
      setIsLoading(false);
      notifications.show({
        title: "Calendar Group Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `Calendar group deleted successfully! Emails regarding the refund process have been sent out to affected customers (if any).`,
      });
      refetchCalendarGroupByPbId();
      router.push("/business/appointments");
    } catch (error: any) {
      setIsLoading(false);
      notifications.show({
        ...getErrorMessageProps("Error Deleting Calendar Group", error),
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
        {isLoading ? (
          <LoadingOverlay visible={isLoading} overlayBlur={1} />
        ) : (
          <>
            <LargeBackButton
              text="Back to Calendar View"
              onClick={() => {
                refetchCalendarGroupByPbId();
                router.push("/business/appointments");
              }}
              size="sm"
              mb="md"
            />
            <Group position="apart">
              <PageTitle
                title={
                  isEditingDisabled
                    ? "View Calendar Group"
                    : "Update Calendar Group"
                }
              />

              {isEditingDisabled && (
                <Group>
                  <LargeEditButton
                    text="Edit"
                    onClick={toggleEdit}
                    size="sm"
                    variant="light"
                    sx={{ border: "1.5px  solid" }}
                  />
                  <DeleteActionButtonModal
                    title="Delete Calendar Group"
                    subtitle="Are you sure you want to delete this Calendar Group?"
                    onDelete={async () =>
                      handleDeleteCalendarGroup(form.values.calendarGroupId)
                    }
                    large
                    variant="light"
                    sx={{ border: "1.5px  solid" }}
                  />
                </Group>
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
                submit={handleUpdateCalendarGroup}
              />
            </Group>
          </>
        )}
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
