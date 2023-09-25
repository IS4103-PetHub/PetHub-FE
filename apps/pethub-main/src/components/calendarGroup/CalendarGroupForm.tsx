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
import React, { useState } from "react";
import CreateButton from "web-ui/shared/LargeCreateButton";
import { useCreateCalendarGroup } from "@/hooks/calendar-group";
import { DayOfWeekEnum, RecurrencePatternEnum } from "@/types/constants";
import { ScheduleSettings, Timeslot } from "@/types/types";
import SettingsForm from "./SettingsForm";

interface CalendarGroupFormProps {
  form: any;
  onClose(): void;
}

const CalendarGroupForm = ({ form, onClose }: CalendarGroupFormProps) => {
  const queryClient = useQueryClient();

  const addNewScheduleSettings = () => {
    const newSetting: ScheduleSettings = {
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
    };
    form.setFieldValue("scheduleSettings", [
      ...form.values.scheduleSettings,
      newSetting,
    ]);
  };

  const removeScheduleSetting = (id: number) => {
    const newSetting = form.values.scheduleSettings.filter(
      (setting) => setting.scheduleSettingsId !== id,
    );
    form.setFieldValue("scheduleSettings", [
      ...form.values.scheduleSettings,
      newSetting,
    ]);
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
    const payload = {};
    console.log("SUBMIT FORM VALUES", values);
    // createCalendarGroup(payload);
  }

  return (
    <form onSubmit={form.onSubmit((values: any) => handleSubmit(values))}>
      <Grid mt="xs" mb="md">
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
        {form.values.scheduleSettings.map(
          (setting: ScheduleSettings, index: number) => (
            <SettingsForm
              key={setting.scheduleSettingsId}
              setting={setting}
              onRemove={() => removeScheduleSetting(setting.scheduleSettingsId)}
              onChange={(changes) =>
                handleScheduleSettingChange(index, changes)
              }
              timeslots={setting.timeslots}
            />
          ),
        )}
        <Grid.Col span={12}>
          <CreateButton
            text="Add a new scheduled setting"
            onClick={addNewScheduleSettings}
            fullWidth
            variant="light"
            radius="md"
          />
        </Grid.Col>
      </Grid>
      <Group mt="25px" position="right">
        <Button type="reset" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </Group>
    </form>
  );
};

export default CalendarGroupForm;
