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
import {
  IconBuildingStore,
  IconCalendar,
  IconCheck,
  IconPawFilled,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";
import CreateButton from "web-ui/shared/LargeCreateButton";
import { DayOfWeekEnum, RecurrencePatternEnum } from "@/types/constants";
import { ScheduleSettings, Timeslot } from "@/types/types";
import SettingsForm from "./SettingsForm";

interface CalendarGroupFormProps {
  form: any;
  onCreate(values: any): void;
  onClose(): void;
}

const CalendarGroupForm = ({
  form,
  onCreate,
  onClose,
}: CalendarGroupFormProps) => {
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings[]>(
    form.values.scheduleSettings,
  );
  const [timeslots, setTimeslots] = useState<Timeslot[]>(form.values.timeslots);

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
    };
    setScheduleSettings([...scheduleSettings, newSetting]);
  };

  const removeScheduleSetting = (id: number) => {
    console.log("SETTINGSID", id);
    const newSettings = scheduleSettings.filter(
      (setting) => setting.scheduleSettingsId !== id,
    );
    setScheduleSettings(newSettings);
  };

  return (
    <form onSubmit={form.onSubmit((values: any) => onCreate(values))}>
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
        {scheduleSettings.map((setting: ScheduleSettings, index: number) => (
          <SettingsForm
            key={setting.scheduleSettingsId}
            initialValues={setting}
            onRemove={() => removeScheduleSetting(setting.scheduleSettingsId)}
            timeslots={timeslots}
            setTimeslots={setTimeslots}
          />
        ))}
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
