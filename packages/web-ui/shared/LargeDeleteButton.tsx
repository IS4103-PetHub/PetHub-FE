import { Button, ButtonProps } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import React from "react";

interface DeleteButtonProps extends ButtonProps {
  text: string;
  onClick?(): void;
}
const DeleteButton = ({ text, onClick, ...props }: DeleteButtonProps) => {
  return (
    <Button
      size="md"
      leftIcon={<IconTrash size="1.25rem" />}
      onClick={onClick}
      {...props}
    >
      {text}
    </Button>
  );
};

export default DeleteButton;
