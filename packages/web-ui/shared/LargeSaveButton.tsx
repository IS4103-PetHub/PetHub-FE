import { Button, ButtonProps } from "@mantine/core";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import React from "react";

interface SaveButtonProps extends ButtonProps {
  text: string;
  onClick?(): void;
}
const SaveButton = ({ text, onClick, ...props }: SaveButtonProps) => {
  return (
    <Button
      size="md"
      leftIcon={<IconDeviceFloppy size="1rem" />}
      onClick={onClick}
      {...props}
    >
      {text}
    </Button>
  );
};

export default SaveButton;
