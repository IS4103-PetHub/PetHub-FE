import { Button, ButtonProps } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import React from "react";

interface BackButtonProps extends ButtonProps {
  text: string;
  onClick?(): void;
  customSize?: string; // Coz I don't wanna mess with the other stuff using this :(
}
const CreateButton = ({
  text,
  onClick,
  customSize,
  ...props
}: BackButtonProps) => {
  return (
    <Button
      size={customSize ? customSize : "md"}
      leftIcon={<IconChevronLeft size="1.25rem" />}
      onClick={onClick}
      {...props}
    >
      {text}
    </Button>
  );
};

export default CreateButton;
