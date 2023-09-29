import {
  TextInput,
  Button,
  Grid,
  Group,
  Textarea,
  Text,
  Stack,
  Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { DayOfWeekEnum, RecurrencePatternEnum } from "shared-utils";
import CreateButton from "web-ui/shared/LargeCreateButton";
import { useCreateCalendarGroup } from "@/hooks/calendar-group";
import { CalendarGroup, ScheduleSettings, TimePeriod } from "@/types/types";
import { checkCGForConflicts, sanitizeCGPayload } from "@/util";
import SettingsForm from "./SettingsForm";

interface CalendarGroupFormProps {
  form: any;
  userId: number;
  forView: boolean; // true if this form is for viewing an existing calendar group, false if it is for creating a new calendar group
  isEditingDisabled?: boolean;
  submit: (payload: CalendarGroup) => void;
  toggleEdit?: () => void;
  cancelEdit?: () => void;
}

const CalendarGroupForm = ({
  form,
  userId,
  forView,
  isEditingDisabled,
  toggleEdit,
  cancelEdit,
  submit,
}: CalendarGroupFormProps) => {
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
            startTime: "00:00",
            endTime: "00:00",
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

  type formValues = typeof form.values;
  function handleSubmit(values: formValues) {
    setSettingsError([]);
    const check = checkCGForConflicts(values.scheduleSettings);
    if (check) {
      setSettingsError([check.indexA, check.indexB]);
      notifications.show({
        title: "Failed to create: schedule conflicts",
        color: "red",
        icon: <IconX />,
        message: check.errorMessage,
      });
    } else {
      const sanitizedCG = sanitizeCGPayload(values);
      if (!forView) {
        sanitizedCG.petBusinessId = userId; // For now create API needs userId
      } else {
        sanitizedCG.calendarGroupId = values.calendarGroupId;
      }
      submit(sanitizedCG);
    }
  }

  return (
    <form onSubmit={form.onSubmit((values: any) => handleSubmit(values))}>
      <Grid mt="sm" mb="sm" gutter="lg">
        <Grid.Col span={12}>
          <TextInput
            label="Name"
            defaultValue={form.values.name}
            placeholder="Enter a name for the calendar group"
            withAsterisk
            disabled={isEditingDisabled}
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            withAsterisk
            defaultValue={form.values.description}
            placeholder="Enter a description for the calendar group"
            label="Description"
            autosize
            minRows={3}
            maxRows={3}
            disabled={isEditingDisabled}
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
              timePeriods={setting?.recurrence?.timePeriods}
              form={form}
              index={index}
              highlight={settingsError.includes(index) ? true : false} // true if that setting's index matches the index returned by the validation during a create
              isEditingDisabled={isEditingDisabled}
            />
          ),
        )}
        {!isEditingDisabled && (
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
        )}
      </Grid>
      <Group mt="25px" position="right">
        {forView ? (
          !isEditingDisabled && (
            <>
              <Button
                type="reset"
                color="red"
                onClick={() => {
                  cancelEdit();
                  toggleEdit();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </>
          )
        ) : (
          <Button type="submit">Create</Button>
        )}
      </Group>
    </form>
  );
};

export default CalendarGroupForm;
