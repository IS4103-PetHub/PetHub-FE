import { Button, ButtonProps } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
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
      leftIcon={<IconArrowBack size="1.25rem" />}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default CreateButton;
