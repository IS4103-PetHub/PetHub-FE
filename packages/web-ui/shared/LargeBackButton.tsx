import { Button, ButtonProps } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import React from "react";

interface BackButtonProps extends ButtonProps {
  text: string;
  onClick(): void;
}

const BackButton = ({ text, onClick, ...props }: BackButtonProps) => {
  return (
    <Button
      size={"md"}
      leftIcon={<IconChevronLeft size="1.25rem" />}
      onClick={onClick}
      {...props}
    >
      {text}
    </Button>
  );
};

export default BackButton;
