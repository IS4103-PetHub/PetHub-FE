import { ActionIcon, useMantineTheme, ActionIconProps } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import React from "react";

interface DeleteActionIconProps extends ActionIconProps {
  onClick(): void;
}
const DeleteActionIcon = ({ onClick, ...props }: DeleteActionIconProps) => {
  const theme = useMantineTheme();
  return (
    <ActionIcon
      size="lg"
      radius="md"
      color="red"
      variant={theme.colorScheme === "light" ? "outline" : "light"}
      sx={{ border: "1.5px solid" }}
      onClick={onClick}
      {...props}
    >
      <IconTrash size={"1.25rem"} />
    </ActionIcon>
  );
};

export default DeleteActionIcon;
