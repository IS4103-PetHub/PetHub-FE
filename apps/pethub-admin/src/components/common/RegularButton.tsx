import { Button, ButtonProps } from "@mantine/core";
import React from "react";

interface RegularButtonProps extends ButtonProps {
  text: string;
}

export const RegularButton = ({ text, ...props }: RegularButtonProps) => {
  return (
    <Button variant="filled" color="violet" uppercase={true} {...props}>
      {text}
    </Button>
  );
};
