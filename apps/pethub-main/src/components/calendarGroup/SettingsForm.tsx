import {
  ActionIcon,
  Grid,
  Group,
  Center,
  Card,
  Text,
  SegmentedControl,
  Box,
  Checkbox,
  NumberInput,
  rem,
} from "@mantine/core";

import { DateInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCalendar, IconClock, IconX } from "@tabler/icons-react";
import React, { useState, useRef } from "react";
import CreateButton from "web-ui/shared/LargeCreateButton";
import { DayOfWeekEnum, RecurrencePatternEnum } from "@/types/constants";
import { ScheduleSettings, Timeslot } from "@/types/types";
import TimeslotForm from "./TimeslotForm";

interface SettingsFormProps {
  initialValues: ScheduleSettings;
  key: number;
  onRemove: () => void;
  timeslots: Timeslot[];
  setTimeslots: (timeslots: Timeslot[]) => void;
}

const SettingsForm = ({
  initialValues,
  key,
  onRemove,
  timeslots,
  setTimeslots,
}: SettingsFormProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const segmentedControlData = [
    {
      value: RecurrencePatternEnum.Daily,
      label: (
        <Center>
          <Box ml={10}>Daily</Box>
        </Center>
      ),
    },
    {
      value: RecurrencePatternEnum.Weekly,
      label: (
        <Center>
          <Box ml={10}>Weekly</Box>
        </Center>
      ),
    },
  ];

  const addTimeslot = () => {
    const newTimeslot: Timeslot = {
      timeslotId: Date.now(), // Using current timestamp as a temporary ID for uniqueness.
      startTime: "",
      endTime: "",
    };
    setTimeslots([...timeslots, newTimeslot]);
  };

  const removeTimeslot = (id: number) => {
    console.log("timeslotId", id);
    const newTimeslot = timeslots.filter(
      (timeslot) => timeslot.timeslotId !== id,
    );
    setTimeslots(newTimeslot);
  };

  const form = useForm({
    initialValues: initialValues,
    validate: {
      scheduleSettingsId: (value) =>
        !value ? "Schedule ID is required." : null,
      days: (value) =>
        value.length === 0 ? "At least one day should be selected." : null,
      startTime: (value) => null,
      endTime: (value) => null,
      vacancies: (value) =>
        value <= 0 ? "Vacancies should be a positive integer." : null,
      pattern: (value) =>
        value !== RecurrencePatternEnum.Daily &&
        value !== RecurrencePatternEnum.Weekly
          ? "Invalid pattern selected."
          : null,
      startDate: (value) => null,
      endDate: (value) => null,
    },
  });

  return (
    <>
      <Grid.Col span={12}>
        <Card withBorder shadow="md" radius="md" sx={{ overflow: "visible" }}>
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group position="apart">
              <Text>Schedule settings</Text>
              <IconX
                size="1rem"
                onClick={onRemove}
                style={{ cursor: "pointer" }}
              />
            </Group>
          </Card.Section>
          <Card.Section inheritPadding mb="md">
            <Group position="apart">
              <DateInput
                label="Start date"
                placeholder="Enter start date"
                valueFormat="DD/MM/YYYY"
                icon={<IconCalendar size="1rem" />}
                sx={{ width: "48%" }}
                {...form.getInputProps(`startDate`)}
              />
              <DateInput
                label="End date"
                placeholder="Enter end date"
                valueFormat="DD/MM/YYYY"
                icon={<IconCalendar size="1rem" />}
                sx={{ width: "48%" }}
                {...form.getInputProps(`endDate`)}
              />
            </Group>
          </Card.Section>
          <Card.Section inheritPadding mb="md">
            <NumberInput
              label="Vancancies"
              placeholder=""
              defaultValue={0}
              hideControls
              min={0}
              {...form.getInputProps(`vacancies`)}
            />
          </Card.Section>
          <Card.Section inheritPadding mb="md">
            <Text fz="0.875rem" fw={500} color="#212529">
              Recurrence
            </Text>
            <SegmentedControl
              fullWidth
              size="xs"
              data={segmentedControlData}
              {...form.getInputProps(`pattern`)}
            />
          </Card.Section>
          {form.values.pattern === RecurrencePatternEnum.Weekly && (
            <Card.Section inheritPadding mb="md">
              <Checkbox.Group
                defaultValue={["react"]}
                label="Select the recurring days of the week"
                mt="md"
              >
                <Group mt="xs">
                  <Checkbox value={DayOfWeekEnum.Monday} label="Mon" />
                  <Checkbox value={DayOfWeekEnum.Tuesday} label="Tue" />
                  <Checkbox value={DayOfWeekEnum.Wednesday} label="Wed" />
                  <Checkbox value={DayOfWeekEnum.Thursday} label="Thu" />
                  <Checkbox value={DayOfWeekEnum.Friday} label="Fri" />
                  <Checkbox value={DayOfWeekEnum.Saturday} label="Sat" />
                  <Checkbox value={DayOfWeekEnum.Sunday} label="Sun" />
                </Group>
                {/* {...form.getInputProps(`days`)} */}
              </Checkbox.Group>
            </Card.Section>
          )}
          <Card.Section inheritPadding mb="md">
            {timeslots.length > 0 && (
              <Group position="apart">
                <Text
                  fz="0.875rem"
                  fw={500}
                  color="#212529"
                  sx={{ width: "40%" }}
                >
                  Start time
                </Text>
                <Text
                  fz="0.875rem"
                  fw={500}
                  color="#212529"
                  sx={{ width: "54%" }}
                >
                  End time
                </Text>
              </Group>
            )}
            {timeslots.map((timeslot: Timeslot, index: number) => (
              <TimeslotForm
                key={timeslot.timeslotId}
                initialValues={timeslot}
                onRemove={() => removeTimeslot(timeslot.timeslotId)}
              />
            ))}
          </Card.Section>
          <Card.Section inheritPadding mb="md">
            <CreateButton
              text="Add another time period"
              fullWidth
              variant=""
              mt="sm"
              onClick={addTimeslot}
            />
          </Card.Section>
        </Card>
      </Grid.Col>
    </>
  );
};

export default SettingsForm;
