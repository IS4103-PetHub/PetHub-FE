import { Button, ButtonProps } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import React from "react";

interface EditButtonProps extends ButtonProps {
  text: string;
  onClick?(): void;
}
const EditButton = ({ text, onClick, ...props }: EditButtonProps) => {
  return (
    <Button
      size={"md"}
      leftIcon={<IconPencil size="1rem" />}
      onClick={onClick}
      {...props}
    >
      {text}
    </Button>
  );
};

export default EditButton;
