import { Button, ButtonProps } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";

interface ViewButtonWithEventProps extends ButtonProps {
  onClick?: (e: any) => void;
}

export const ViewButtonWithEvent = ({
  onClick,
  ...props
}: ViewButtonWithEventProps) => {
  return (
    <Button
      size="sm"
      leftIcon={<IconSearch size="1rem" />}
      onClick={onClick}
      {...props}
    >
      View
    </Button>
  );
};
