import { Button, ButtonProps } from "@mantine/core";
import React from "react";

interface RegularButtonProps extends ButtonProps {
  text: string;
  onClick?: () => {};
}

export const RegularButton = ({
  text,
  onClick,
  ...props
}: RegularButtonProps) => {
  return (
    <Button
      variant="filled"
      color="violet"
      uppercase={true}
      onClick={onClick}
      {...props}
    >
      {text}
    </Button>
  );
};
