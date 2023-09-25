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
import { ScheduleSettings, TimePeriod } from "@/types/types";
import TimePeriodForm from "./TimePeriodForm";

interface SettingsFormProps {
  setting: ScheduleSettings;
  onRemove: () => void;
  onChange: any;
  timePeriods: TimePeriod[];
}

const SettingsForm = ({
  setting,
  onRemove,
  onChange,
  timePeriods = [],
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

  const addTimePeriod = () => {
    const newTimePeriod: TimePeriod = {
      timePeriodId: Date.now(), // Using current timestamp as a temporary ID for uniqueness
      startTime: "",
      endTime: "",
    };
    onChange({
      recurrence: {
        ...setting.recurrence,
        timePeriods: [...timePeriods, newTimePeriod],
      },
    });
  };

  const removeTimePeriod = (id: number) => {
    if (timePeriods.length === 1) return;
    const newTimePeriod = timePeriods.filter(
      (timePeriod) => timePeriod.timePeriodId !== id,
    );
    onChange({
      recurrence: { ...setting.recurrence, timePeriods: newTimePeriod },
    });
  };

  const handleTimePeriodChange = (index: number, changes: TimePeriod) => {
    const updatedTimePeriods = [...timePeriods];
    updatedTimePeriods[index] = { ...updatedTimePeriods[index], ...changes };
    onChange({
      recurrence: { ...setting.recurrence, timePeriods: updatedTimePeriods },
    });
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
              onChange={(value) =>
                onChange({
                  recurrence: { ...setting.recurrence, startDate: value },
                })
              }
            />
            <DateInput
              label="End date"
              placeholder="Enter end date"
              valueFormat="DD/MM/YYYY"
              icon={<IconCalendar size="1rem" />}
              sx={{ width: "48%" }}
              onChange={(value) =>
                onChange({
                  recurrence: { ...setting.recurrence, endDate: value },
                })
              }
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
            Recurrence pattern
          </Text>
          <SegmentedControl
            fullWidth
            size="xs"
            data={segmentedControlData}
            onChange={(value) =>
              onChange({
                recurrence: { ...setting.recurrence, pattern: value },
              })
            }
          />
        </Card.Section>
        {setting.recurrence.pattern === RecurrencePatternEnum.Weekly && (
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
          {timePeriods.length > 0 && (
            <Group>
              <Text fz="0.875rem" fw={500} color="#212529" ml={73}>
                Start time
              </Text>
              <Text fz="0.875rem" fw={500} color="#212529" ml={310}>
                End time
              </Text>
            </Group>
          )}
          {timePeriods.map((timePeriod: TimePeriod, index: number) => (
            <TimePeriodForm
              key={timePeriod.timePeriodId}
              index={index}
              timePeriod={timePeriod}
              onRemove={() => removeTimePeriod(timePeriod.timePeriodId)}
              onChange={(changes) => handleTimePeriodChange(index, changes)}
            />
          ))}
        </Card.Section>
        <Card.Section inheritPadding mb="lg">
          <CreateButton
            text="Add another time period"
            fullWidth
            variant=""
            mt="sm"
            onClick={addTimePeriod}
          />
        </Card.Section>
      </Card>
    </Grid.Col>
  );
};

export default SettingsForm;
