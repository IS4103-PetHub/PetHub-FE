import { ActionIcon, Group, rem, Text } from "@mantine/core";
import React, { useRef, useState } from "react";
import DeleteActionIcon from "web-ui/shared/DeleteActionIcon";
import TimeSelect from "web-ui/shared/TimeSelect";
import { TimePeriod } from "@/types/types";

interface timePeriodFormProps {
  timePeriod: TimePeriod;
  index: number;
  onRemove: () => void;
  onChange: any;
}

const TimePeriodForm = ({
  timePeriod,
  index,
  onRemove,
  onChange,
}: timePeriodFormProps) => {
  // Ensures sequential mounting of TimeSelects to avoid weird state synchronization issues with the onChange for both TimeSelects
  const [isEndTimeInitialized, setIsEndTimeInitialized] = useState(false);
  const TIME_INTERVAL = 30;

  return (
    <>
      <Group position="apart" mb="xs">
        <Group sx={{ width: "92%" }}>
          <Text fz="0.875rem" fw={500} color="#212529">
            Period {index + 1}:{" "}
          </Text>
          <TimeSelect
            interval={TIME_INTERVAL}
            sx={{ width: "45%" }}
            onChange={(startTime) => {
              console.log("Selected StartTime:", startTime);
              onChange({ startTime: startTime });
              setIsEndTimeInitialized(true);
            }}
          />
          {isEndTimeInitialized && (
            <TimeSelect
              interval={TIME_INTERVAL}
              onChange={(endTime) => {
                console.log("Selected endTime:", endTime);
                onChange({ endTime: endTime });
              }}
            />
          )}
        </Group>
        <DeleteActionIcon onClick={onRemove} />
      </Group>
    </>
  );
};

export default TimePeriodForm;
