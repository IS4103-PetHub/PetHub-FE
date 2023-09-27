import {
  TextInput,
  Button,
  Grid,
  Group,
  Textarea,
  Center,
  Card,
  Menu,
  Text,
  Switch,
  SegmentedControl,
  Box,
  Checkbox,
  Stack,
  Divider,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconBuildingStore,
  IconCalendar,
  IconCheck,
  IconPawFilled,
  IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useState } from "react";
import CreateButton from "web-ui/shared/LargeCreateButton";
import { useCreateCalendarGroup } from "@/hooks/calendar-group";
import { DayOfWeekEnum, RecurrencePatternEnum } from "@/types/constants";
import { ScheduleSettings, TimePeriod } from "@/types/types";
import { checkCGForConflicts, sanitizeCreateCGPayload } from "@/util";
import SettingsForm from "./SettingsForm";

interface CalendarGroupFormProps {
  form: any;
}

const CalendarGroupForm = ({ form }: CalendarGroupFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [settingsError, setSettingsError] = useState([]);

  const rulesToDisplay = [
    "End dates must not be more than 3 months from the current date",
    "For schedules with conflicting start and end dates with the recurrence pattern of 'Weekly', ensure that the recurring days selected do not overlap.",
    "Schedules with the recurrence pattern of 'Daily' cannot have overlapping start and end dates.",
    "Schedules with the recurrence pattern of 'Daily' will override schedules with the recurrence pattern of 'Weekly' if they have conflicting start and end dates.",
  ];

  const addNewScheduleSettings = () => {
    const newSetting: ScheduleSettings = {
      scheduleSettingsId: Date.now(), // Using current timestamp as a temporary ID for uniqueness.
      days: [],
      recurrence: {
        pattern: RecurrencePatternEnum.Daily,
        startDate: "",
        endDate: "",
        timePeriods: [
          {
            timePeriodId: Date.now(), // default timeslot
            startTime: "",
            endTime: "",
            vacancies: 1,
          },
        ],
      },
    };
    form.setFieldValue("scheduleSettings", [
      ...form.values.scheduleSettings,
      newSetting,
    ]);
  };

  const removeScheduleSetting = (id: number) => {
    if (form.values.scheduleSettings.length === 1) return;
    const newSettings = form.values.scheduleSettings.filter(
      (setting) => setting.scheduleSettingsId !== id,
    );
    form.setFieldValue("scheduleSettings", newSettings);
  };

  const handleScheduleSettingChange = (index, changes) => {
    const newScheduleSettings = [...form.values.scheduleSettings];
    newScheduleSettings[index] = { ...newScheduleSettings[index], ...changes };
    form.setFieldValue("scheduleSettings", newScheduleSettings);
  };

  const createCalendarGroupMutation = useCreateCalendarGroup(queryClient);
  const createCalendarGroup = async (payload: any) => {
    try {
      await createCalendarGroupMutation.mutateAsync(payload);
      notifications.show({
        title: "Calendar group created",
        color: "green",
        icon: <IconCheck />,
        message: `Calendar group created successfully!`,
      });
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

  type formValues = typeof form.values;
  function handleSubmit(values: formValues) {
    setSettingsError([]);
    const payload = {};
    console.log("SUBMIT FORM VALUES", JSON.stringify(values));
    const check = checkCGForConflicts(values.scheduleSettings);
    console.log("CHECK CONFLICTS", check);
    if (check) {
      setSettingsError([check.indexA, check.indexB]);
      notifications.show({
        title: "Failed to create: schedule conflicts",
        color: "red",
        icon: <IconX />,
        message: check.errorMessage,
      });
    } else {
      const newCG = sanitizeCreateCGPayload(values);
      console.log("SANTIZED CG PAYLOAD", JSON.stringify(newCG));
      // createCalendarGroup(payload);
    }
  }

  return (
    <form onSubmit={form.onSubmit((values: any) => handleSubmit(values))}>
      <Grid mt="sm" mb="sm" gutter="lg">
        <Grid.Col span={12}>
          <TextInput
            label="Name"
            placeholder="Enter a name for the calendar group"
            withAsterisk
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            withAsterisk
            placeholder="Enter a description for the calendar group"
            label="Description"
            autosize
            minRows={3}
            maxRows={3}
            {...form.getInputProps("description")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Stack>
            <Text size="xl" weight={600} mt="lg">
              Calendar Schedules
            </Text>
            <Text color="dark" mt={-10}>
              Create schedules with the relavant schedule settings and desired
              time periods here
            </Text>
            {rulesToDisplay.map((rule, index) => (
              <Text color="dimmed" mt={-10} fz="sm" key={index}>
                {index + 1}. {rule}
              </Text>
            ))}
            <Divider mb="md" />
          </Stack>
        </Grid.Col>
        {form.values.scheduleSettings?.map(
          (setting: ScheduleSettings, index: number) => (
            <SettingsForm
              key={setting.scheduleSettingsId}
              setting={setting}
              onRemove={() => removeScheduleSetting(setting.scheduleSettingsId)}
              onChange={(changes) =>
                handleScheduleSettingChange(index, changes)
              }
              timePeriods={setting.recurrence.timePeriods}
              form={form}
              index={index}
              highlight={settingsError.includes(index) ? true : false} // true if that setting's index matches the index returned by the validation during a create
            />
          ),
        )}
        <Grid.Col span={12}>
          <CreateButton
            text="Add another schedule"
            onClick={addNewScheduleSettings}
            fullWidth
            variant="light"
            radius="lg"
            h={320}
          />
        </Grid.Col>
      </Grid>
      <Group mt="25px" position="right">
        <Button
          type="reset"
          color="gray"
          onClick={() => router.push("/business/calendargroup")}
        >
          Back
        </Button>
        <Button type="submit">Create</Button>
      </Group>
    </form>
  );
};

export default CalendarGroupForm;
