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
  useMantineTheme,
} from "@mantine/core";

import { DateInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCalendar, IconClock, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useState, useRef } from "react";
import CreateButton from "web-ui/shared/LargeCreateButton";
import { DayOfWeekEnum, RecurrencePatternEnum } from "@/types/constants";
import { ScheduleSettings, TimePeriod } from "@/types/types";
import styles from "../../styles/Card.module.css";
import TimePeriodForm from "./TimePeriodForm";

interface SettingsFormProps {
  setting: ScheduleSettings;
  onRemove: () => void;
  onChange: any;
  timePeriods: TimePeriod[];
  form: any;
  index: number;
  highlight: boolean;
  isEditingDisabled: boolean;
}

const SettingsForm = ({
  setting,
  onRemove,
  onChange,
  timePeriods = [],
  form,
  index,
  highlight,
  isEditingDisabled,
}: SettingsFormProps) => {
  const errors = form.errors?.scheduleSettings?.errors;
  const theme = useMantineTheme();

  // These are for a CG update, to determine if editing the dates should be disabled or not (If the date is in the past you shouldn't be able to edit them)
  const isPastDate = (date) => date && dayjs(date).isBefore(dayjs());
  const isStartDateDisabled =
    setting?.recurrence?.startDate && isPastDate(setting.recurrence.startDate);
  const isSettingOver =
    setting?.recurrence?.endDate && isPastDate(setting.recurrence.endDate);

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

  // GetDayOfWeek shortform
  const getShortForm = (day: string) => {
    return (
      day.charAt(0) + day.toLowerCase().charAt(1) + day.toLowerCase().charAt(2)
    );
  };

  const addTimePeriod = () => {
    const newTimePeriod: TimePeriod = {
      timePeriodId: Date.now(), // Using current timestamp as a temporary ID for uniqueness
      startTime: "00:00",
      endTime: "00:00",
      vacancies: 1,
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
      <Card
        shadow="md"
        radius="lg"
        sx={{
          overflow: "visible",
          border: "1px solid gray",
          borderColor: highlight && theme.colors.red[6],
        }}
      >
        <Card.Section withBorder inheritPadding py="xs" mb="md">
          <Group position="apart">
            <Text>Schedule setting {index + 1}</Text>
            <ActionIcon
              onClick={onRemove}
              style={{ cursor: "pointer" }}
              disabled={isEditingDisabled}
            >
              <IconX size="1rem" />
            </ActionIcon>
          </Group>
        </Card.Section>
        <Card.Section inheritPadding mb="lg">
          <Group position="apart">
            <DateInput
              clearable
              defaultValue={
                setting?.recurrence?.startDate
                  ? new Date(setting.recurrence.startDate)
                  : null
              }
              minDate={dayjs(new Date()).add(1, "day").toDate()}
              maxDate={dayjs(new Date()).add(3, "month").toDate()}
              label="Start date"
              placeholder="Enter start date"
              valueFormat="DD/MM/YYYY"
              icon={<IconCalendar size="1rem" />}
              sx={{ width: "48%" }}
              disabled={isEditingDisabled || isStartDateDisabled}
              onChange={(value) =>
                onChange({
                  recurrence: { ...setting.recurrence, startDate: value },
                })
              }
              error={errors?.[index]?.recurrence?.startDate}
            />
            <DateInput
              clearable
              defaultValue={
                setting?.recurrence?.endDate
                  ? new Date(setting.recurrence.endDate)
                  : null
              }
              minDate={dayjs(new Date()).add(1, "day").toDate()}
              maxDate={dayjs(new Date()).add(3, "month").toDate()}
              label="End date"
              placeholder="Enter end date"
              valueFormat="DD/MM/YYYY"
              icon={<IconCalendar size="1rem" />}
              sx={{ width: "48%" }}
              disabled={isEditingDisabled || isSettingOver}
              onChange={(value) =>
                onChange({
                  recurrence: { ...setting.recurrence, endDate: value },
                })
              }
              error={errors?.[index]?.recurrence?.endDate}
            />
          </Group>
        </Card.Section>
        <Card.Section inheritPadding mb="lg">
          <Text fz="0.875rem" fw={500} color={theme.colors.gray[9]}>
            Recurrence pattern
          </Text>
          <SegmentedControl
            defaultValue={setting?.recurrence?.pattern}
            fullWidth
            size="xs"
            data={segmentedControlData}
            disabled={isEditingDisabled || isSettingOver}
            onChange={(value) =>
              onChange({
                recurrence: { ...setting.recurrence, pattern: value },
              })
            }
          />
        </Card.Section>
        {setting?.recurrence?.pattern === RecurrencePatternEnum.Weekly && (
          <Card.Section inheritPadding mb="lg">
            <Checkbox.Group
              defaultValue={setting?.days}
              label="Select the recurring days of the week"
              onChange={(value) => onChange({ days: value })}
              error={errors?.[index]?.days}
            >
              <Group mt="xs" mb="xs">
                {Object.values(DayOfWeekEnum).map((day) => (
                  <Checkbox
                    key={day}
                    value={day}
                    label={getShortForm(day)}
                    disabled={isEditingDisabled || isSettingOver}
                  />
                ))}
              </Group>
            </Checkbox.Group>
          </Card.Section>
        )}
        <Card.Section inheritPadding mb="lg">
          {timePeriods.map((timePeriod: TimePeriod, idx: number) => (
            <TimePeriodForm
              key={timePeriod.timePeriodId}
              index={idx}
              timePeriod={timePeriod}
              onRemove={() => removeTimePeriod(timePeriod.timePeriodId)}
              onChange={(changes) => handleTimePeriodChange(idx, changes)}
              errors={errors?.[index]?.recurrence?.timePeriods}
              isEditingDisabled={isEditingDisabled || isSettingOver}
            />
          ))}
        </Card.Section>
        <Card.Section inheritPadding mb="lg">
          {!isEditingDisabled && (
            <CreateButton
              text="Add another time period"
              fullWidth
              variant="white"
              mt="sm"
              mb="sm"
              onClick={addTimePeriod}
            />
          )}
        </Card.Section>
      </Card>
    </Grid.Col>
  );
};

export default SettingsForm;
