import { ActionIcon, Group, rem, Text } from "@mantine/core";
import React, { useRef } from "react";
import DeleteActionIcon from "web-ui/shared/DeleteActionIcon";
import TimeSelect from "web-ui/shared/TimeSelect";
import { Timeslot } from "@/types/types";

interface TimeslotFormProps {
  timeslot: Timeslot;
  index: number;
  onRemove: () => void;
  onChange: any;
}

const TimeslotForm = ({
  timeslot,
  index,
  onRemove,
  onChange,
}: TimeslotFormProps) => {
  const TIME_INTERVAL = 30;

  return (
    <>
      <Group position="apart" mb="xs">
        <Group sx={{ width: "92%" }}>
          <Text fz="0.875rem" fw={500} color="#212529">
            Timeslot {index + 1}:{" "}
          </Text>
          <TimeSelect
            interval={TIME_INTERVAL}
            sx={{ width: "45%" }}
            onChange={(startTime) => {
              console.log("Selected StartTime:", startTime);
              onChange({ startTime: startTime });
            }}
          />
          <TimeSelect
            interval={TIME_INTERVAL}
            onChange={(endTime) => {
              console.log("Selected endTime:", endTime);
              onChange({ endTime: endTime });
            }}
          />
        </Group>
        <DeleteActionIcon onClick={onRemove} />
      </Group>
    </>
  );
};

export default TimeslotForm;
