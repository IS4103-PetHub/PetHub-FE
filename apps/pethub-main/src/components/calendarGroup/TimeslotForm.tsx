import { ActionIcon, Group, rem, Text } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconClock, IconTrash } from "@tabler/icons-react";
import React, { useRef } from "react";
import DeleteActionIcon from "web-ui/shared/DeleteActionIcon";
import { Timeslot } from "@/types/types";

interface TimeslotFormProps {
  initialValues: Timeslot;
  key: number;
  onRemove: () => void;
}

const TimeslotForm = ({ initialValues, key, onRemove }: TimeslotFormProps) => {
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

  const form = useForm({
    initialValues: initialValues,
    validate: {
      timeslotId: (value) => null,
      startTime: (value) => null,
      endTime: (value) => null,
    },
  });

  return (
    <>
      <Group position="apart" mb="xs">
        <Group sx={{ width: "90%" }}>
          <TimeInput
            ref={startTimeRef}
            rightSection={startTimePickerControl}
            sx={{ width: "48%" }}
            {...form.getInputProps(`startTime`)}
          />
          <TimeInput
            ref={endTimeRef}
            rightSection={endTimePickerControl}
            sx={{ width: "48%" }}
            {...form.getInputProps(`endTime`)}
          />
        </Group>
        <DeleteActionIcon onClick={onRemove} />
      </Group>
    </>
  );
};

export default TimeslotForm;
