import { Button, ButtonProps } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import React from "react";

interface ViewButtonProps extends ButtonProps {
  text: string;
  onClick?(): void;
}
const ViewButton = ({ text, onClick, ...props }: ViewButtonProps) => {
  return (
    <Button
      size="md"
      leftIcon={<IconEye size="1.25rem" />}
      onClick={onClick}
      {...props}
    >
      {text}
    </Button>
  );
};

export default ViewButton;
