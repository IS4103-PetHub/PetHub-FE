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
  useMantineTheme,
  Divider,
} from "@mantine/core";

import { DateInput } from "@mantine/dates";
import { IconCalendar, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import React from "react";
import {
  ScheduleSettings,
  TimePeriod,
  RecurrencePatternEnum,
  DayOfWeekEnum,
} from "shared-utils";
import CreateButton from "web-ui/shared/LargeCreateButton";
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
  // const isStartDateDisabled = setting?.recurrence?.startDate && isPastDate(setting.recurrence.startDate);
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

  function renderItemGroup(label: string, value: string | any[]) {
    if (Array.isArray(value) && value.length > 0) {
      return (
        <>
          <Group ml="xl" mr="xl" mb="md" position="apart">
            <Text fw={600}>{label}</Text>
            <Text color="dimmed">
              {value.map((item, index) => (
                <span key={item.id}>
                  {index > 0 ? ", " : ""}
                  {item.name}
                </span>
              ))}
            </Text>
          </Group>
          <Divider mb="md" />
        </>
      );
    } else if (typeof value === "string") {
      return (
        <>
          {value && (
            <>
              <Group ml="xl" mr="xl" mb="md" position="apart">
                <Text fw={600}>{label}</Text>
                <Text color="dimmed">{value}</Text>
              </Group>
              <Divider mb="md" />
            </>
          )}
        </>
      );
    }
    return null;
  }

  return (
    <Grid.Col span={12}>
      <Card
        shadow="sm"
        radius="lg"
        sx={{
          overflow: "visible",
          border: "1px solid lightgray",
          borderColor: highlight && theme.colors.red[6],
        }}
      >
        <Card.Section withBorder inheritPadding py="xs" mb="md">
          <Group position="apart">
            <Text weight={600}>Schedule Setting {index + 1}</Text>
            {form.values.scheduleSettings.length > 1 && (
              <ActionIcon
                onClick={onRemove}
                style={{ cursor: "pointer" }}
                disabled={isEditingDisabled}
              >
                <IconX size="1rem" />
              </ActionIcon>
            )}
          </Group>
        </Card.Section>
        <Card.Section inheritPadding mb="lg">
          {isEditingDisabled ? (
            <>
              {renderItemGroup(
                "Start date",
                dayjs(setting?.recurrence?.startDate).format("DD/MM/YYYY"),
              )}
              {renderItemGroup(
                "End date",
                dayjs(setting?.recurrence?.endDate).format("DD/MM/YYYY"),
              )}
            </>
          ) : (
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
                placeholder="Start date (DD/MM/YYYY)"
                valueFormat="DD/MM/YYYY"
                icon={<IconCalendar size="1rem" />}
                sx={{ width: "48%" }}
                disabled={isEditingDisabled}
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
                placeholder="End date (DD/MM/YYYY)"
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
          )}
        </Card.Section>
        <Card.Section inheritPadding mb="lg">
          {isEditingDisabled ? (
            renderItemGroup("Recurrence pattern", setting?.recurrence.pattern)
          ) : (
            <>
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
              {setting?.recurrence?.pattern === RecurrencePatternEnum.Daily && (
                <Text fs="italic" fz="xs" mt="xs" color="orange">
                  {
                    "Since 'Daily' is selected, any time periods set will override other schedule settings with recurrence pattern of 'Weekly' for any overlapping dates."
                  }
                </Text>
              )}
            </>
          )}
        </Card.Section>
        <Card.Section inheritPadding mb="lg">
          {isEditingDisabled ? (
            renderItemGroup(
              "Recurring days",
              setting?.days?.map((day) => ({ id: day, name: day })),
            )
          ) : (
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
          )}
        </Card.Section>
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
              numberOfTimeslots={
                form.values.scheduleSettings[index].recurrence.timePeriods
                  .length
              }
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
