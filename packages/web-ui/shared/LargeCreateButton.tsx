import { Button, ButtonProps } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import React from "react";

interface CreateButtonProps extends ButtonProps {
  text: string;
  onClick?(): void;
}
const CreateButton = ({ text, onClick, ...props }: CreateButtonProps) => {
  return (
    <Button
      size="md"
      leftIcon={<IconPlus size="1rem" />}
      onClick={onClick}
      {...props}
    >
      {text}
    </Button>
  );
};

export default CreateButton;
