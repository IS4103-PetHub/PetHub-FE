import { Button, ButtonProps } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";

interface ViewButtonProps extends ButtonProps {
  onClick?: () => void;
}

export const ViewButton = ({ onClick, ...props }: ViewButtonProps) => {
  return (
    <Button size="sm" leftIcon={<IconSearch />} onClick={onClick} {...props}>
      View
    </Button>
  );
};
