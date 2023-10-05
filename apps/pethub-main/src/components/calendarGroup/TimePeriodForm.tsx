import {
  Box,
  Center,
  Grid,
  NumberInput,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React, { useState } from "react";
import { TimePeriod } from "shared-utils";
import DeleteActionIcon from "web-ui/shared/DeleteActionIcon";
import TimeSelect from "web-ui/shared/TimeSelect";

interface timePeriodFormProps {
  timePeriod: TimePeriod;
  index: number;
  onRemove: () => void;
  onChange: any;
  errors: any;
  isEditingDisabled: boolean;
  numberOfTimeslots: number;
}

const TimePeriodForm = ({
  timePeriod,
  index,
  onRemove,
  onChange,
  errors,
  isEditingDisabled,
  numberOfTimeslots,
}: timePeriodFormProps) => {
  // Ensures sequential mounting of TimeSelects to avoid weird state synchronization issues with the onChange for both TimeSelects
  const theme = useMantineTheme();
  const [isEndTimeInitialized, setIsEndTimeInitialized] = useState(false);
  const TIME_INTERVAL = 30;

  return (
    <>
      <Grid>
        <Center>
          <Box mr={20} ml="xs">
            <Text fz="0.875rem" fw={500} color={theme.colors.gray[9]} mt={24}>
              Period {index + 1}:{" "}
            </Text>
          </Box>
          <Box mr={50}>
            <TimeSelect
              defaultTime={timePeriod.startTime ?? null}
              label={index === 0 && "Start time"}
              interval={TIME_INTERVAL}
              disabled={isEditingDisabled}
              onChange={(value) => {
                onChange({ startTime: value });
                setIsEndTimeInitialized(true);
              }}
            />
          </Box>
          <Box mr={50}>
            {isEndTimeInitialized && (
              <TimeSelect
                defaultTime={timePeriod.endTime ?? null}
                label={index === 0 && "End time"}
                interval={TIME_INTERVAL}
                disabled={isEditingDisabled}
                onChange={(value) => {
                  onChange({ endTime: value });
                }}
              />
            )}
          </Box>
          <Box mr={50}>
            <NumberInput
              label={index === 0 ? "Vacancies" : " "}
              w={80}
              disabled={isEditingDisabled}
              placeholder=""
              defaultValue={timePeriod.vacancies || 1}
              min={1}
              onChange={(value) => onChange({ vacancies: value })}
              error={errors?.[index]?.vacancies}
            />
          </Box>
          <Box sx={{ display: numberOfTimeslots <= 1 ? "none" : "inline" }}>
            <DeleteActionIcon
              onClick={onRemove}
              mt={24}
              disabled={isEditingDisabled}
            />
          </Box>
        </Center>
        {errors && (
          <Text color={theme.colors.red[5]} fz="0.75rem" ml={85} mt={1}>
            {errors[index]}
          </Text>
        )}
      </Grid>
    </>
  );
};

export default TimePeriodForm;
