import {
  NumberInput,
  Group,
  ActionIcon,
  NumberInputHandlers,
  rem,
} from "@mantine/core";
import { useState, useRef } from "react";

interface NumberInputWithIconsProps {
  value: number | "";
  setValue: (value: number | "") => void;
  min: number;
  max: number;
  step: number;
}

function NumberInputWithIcons({
  value,
  setValue,
  min,
  max,
  step,
  ...props
}: NumberInputWithIconsProps) {
  const handlers = useRef<NumberInputHandlers>();

  return (
    <Group spacing={5} {...props}>
      <ActionIcon
        size={42}
        variant="default"
        onClick={() => handlers.current.decrement()}
      >
        –
      </ActionIcon>

      <NumberInput
        hideControls
        value={value}
        onChange={(val) => setValue(val)}
        handlersRef={handlers}
        max={max}
        min={min}
        step={step}
        styles={{ input: { width: rem(54), textAlign: "center" } }}
      />

      <ActionIcon
        size={42}
        variant="default"
        onClick={() => handlers.current.increment()}
      >
        +
      </ActionIcon>
    </Group>
  );
}

export default NumberInputWithIcons;
