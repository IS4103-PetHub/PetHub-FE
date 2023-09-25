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
  setting: ScheduleSettings;
  onRemove: () => void;
  onChange: any;
  timeslots: Timeslot[];
}

const SettingsForm = ({
  setting,
  onRemove,
  onChange,
  timeslots = [],
}: SettingsFormProps) => {
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
    onChange({ timeslots: [...timeslots, newTimeslot] });
  };

  const removeTimeslot = (id: number) => {
    if (timeslots.length === 1) return;
    const newTimeslot = timeslots.filter(
      (timeslot) => timeslot.timeslotId !== id,
    );
    onChange({ timeslots: newTimeslot });
  };

  const handleTimeslotChange = (index: number, changes: Timeslot) => {
    const updatedTimeslots = [...timeslots];
    updatedTimeslots[index] = { ...updatedTimeslots[index], ...changes };
    onChange({ timeslots: updatedTimeslots });
  };

  return (
    <Grid.Col span={12}>
      <Card withBorder shadow="md" radius="lg" sx={{ overflow: "visible" }}>
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
        <Card.Section inheritPadding mb="lg">
          <Group position="apart">
            <DateInput
              label="Start date"
              placeholder="Enter start date"
              valueFormat="DD/MM/YYYY"
              icon={<IconCalendar size="1rem" />}
              sx={{ width: "48%" }}
              onChange={(value) => onChange({ startDate: value })}
            />
            <DateInput
              label="End date"
              placeholder="Enter end date"
              valueFormat="DD/MM/YYYY"
              icon={<IconCalendar size="1rem" />}
              sx={{ width: "48%" }}
              onChange={(value) => onChange({ endDate: value })}
            />
          </Group>
        </Card.Section>
        <Card.Section inheritPadding mb="lg">
          <NumberInput
            label="Vacancies"
            placeholder=""
            defaultValue={1}
            hideControls
            min={1}
            onChange={(value) => onChange({ vacancies: value })}
          />
        </Card.Section>
        <Card.Section inheritPadding mb="lg">
          <Text fz="0.875rem" fw={500} color="#212529">
            Recurrence
          </Text>
          <SegmentedControl
            fullWidth
            size="xs"
            data={segmentedControlData}
            onChange={(value) => onChange({ pattern: value })}
          />
        </Card.Section>
        {setting.pattern === RecurrencePatternEnum.Weekly && (
          <Card.Section inheritPadding mb="lg">
            <Checkbox.Group
              defaultValue={setting.days}
              label="Select the recurring days of the week"
              onChange={(value) => onChange({ days: value })}
            >
              <Group mt="xs">
                <Checkbox value={DayOfWeekEnum.Monday} label="Mon" />
                <Checkbox value={DayOfWeekEnum.Tuesday} label="Tues" />
                <Checkbox value={DayOfWeekEnum.Wednesday} label="Wed" />
                <Checkbox value={DayOfWeekEnum.Thursday} label="Thurs" />
                <Checkbox value={DayOfWeekEnum.Friday} label="Fri" />
                <Checkbox value={DayOfWeekEnum.Saturday} label="Sat" />
                <Checkbox value={DayOfWeekEnum.Sunday} label="Sun" />
              </Group>
            </Checkbox.Group>
          </Card.Section>
        )}
        <Card.Section inheritPadding mb="lg">
          {timeslots.length > 0 && (
            <Group>
              <Text fz="0.875rem" fw={500} color="#212529" ml={85}>
                Start time
              </Text>
              <Text fz="0.875rem" fw={500} color="#212529" ml={310}>
                End time
              </Text>
            </Group>
          )}
          {timeslots.map((timeslot: Timeslot, index: number) => (
            <TimeslotForm
              key={timeslot.timeslotId}
              index={index}
              timeslot={timeslot}
              onRemove={() => removeTimeslot(timeslot.timeslotId)}
              onChange={(changes) => handleTimeslotChange(index, changes)}
            />
          ))}
        </Card.Section>
        <Card.Section inheritPadding mb="lg">
          <CreateButton
            text="Add another timeslot"
            fullWidth
            variant=""
            mt="sm"
            onClick={addTimeslot}
          />
        </Card.Section>
      </Card>
    </Grid.Col>
  );
};

export default SettingsForm;
