import { ActionIcon, Group, rem, Text } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconClock, IconTrash } from "@tabler/icons-react";
import React, { useRef } from "react";
import DeleteActionIcon from "web-ui/shared/DeleteActionIcon";
import { Timeslot } from "@/types/types";

interface TimeslotFormProps {
  timeslot: Timeslot;
  key: number;
  onRemove: () => void;
  onChange: any;
}

const TimeslotForm = ({
  timeslot,
  key,
  onRemove,
  onChange,
}: TimeslotFormProps) => {
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  const startTimePickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => startTimeRef.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const endTimePickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => endTimeRef.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  return (
    <>
      <Group position="apart" mb="xs">
        <Group sx={{ width: "90%" }}>
          <TimeInput
            ref={startTimeRef}
            rightSection={startTimePickerControl}
            sx={{ width: "48%" }}
            onChange={(event) => {
              const timeValue = event.currentTarget.value;
              console.log("Extracted StartTime:", timeValue);
              onChange({ startTime: timeValue });
            }}
          />

          <TimeInput
            ref={endTimeRef}
            rightSection={endTimePickerControl}
            sx={{ width: "48%" }}
            onChange={(event) => {
              const timeValue = event.currentTarget.value;
              console.log("Extracted EndTime:", timeValue);
              onChange({ endTime: timeValue });
            }}
          />
        </Group>
        <DeleteActionIcon onClick={onRemove} />
      </Group>
    </>
  );
};

export default TimeslotForm;
