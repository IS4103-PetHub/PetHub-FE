import {
  TextInput,
  Button,
  Grid,
  Group,
  Textarea,
  Text,
  Stack,
  Divider,
  List,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import {
  CalendarGroup,
  ScheduleSettings,
  RecurrencePatternEnum,
} from "shared-utils";
import CreateButton from "web-ui/shared/LargeCreateButton";
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
    "Time period example: If you have 3 groomers free for a 3 hour period, create a single time period instead of multiple ones. The duration specified in the service listing will determine the booking time slots.",
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
        title: "Failed to Create: Schedule Conflicts",
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
            maxRows={5}
            disabled={isEditingDisabled}
            {...form.getInputProps("description")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Stack>
            <Text size="xl" weight={600} mt="lg">
              Calendar Schedules
            </Text>
            <Text color="dark">
              Create schedules with the relavant schedule settings and desired
              time periods here.
            </Text>
            <List type="ordered" size="sm" spacing="xs">
              {rulesToDisplay.map((rule, index) => (
                <List.Item key={index}>
                  <Text color="dimmed" fz="sm">
                    {rule}
                  </Text>
                </List.Item>
              ))}
            </List>
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
                color="gray"
                onClick={() => {
                  cancelEdit();
                  toggleEdit();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
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
