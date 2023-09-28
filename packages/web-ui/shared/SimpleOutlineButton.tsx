import { Button, ButtonProps } from "@mantine/core";
import React from "react";

interface SimpleOutlineButtonProps extends ButtonProps {
  text: string;
  onClick(): void;
}

const SimpleOutlineButton = ({
  text,
  onClick,
  ...props
}: SimpleOutlineButtonProps) => {
  return (
    <Button
      variant="outline"
      sx={{ border: "1.5px solid" }}
      radius="md"
      onClick={onClick}
      {...props}
    >
      {text}
    </Button>
  );
};

export default SimpleOutlineButton;
