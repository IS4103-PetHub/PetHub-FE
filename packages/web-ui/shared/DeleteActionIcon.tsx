import { ActionIcon, useMantineTheme } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import React from "react";

interface DeleteActionIconProps {
  onClick(): void;
}
const DeleteActionIcon = ({ onClick }: DeleteActionIconProps) => {
  const theme = useMantineTheme();
  return (
    <ActionIcon
      size="lg"
      radius="md"
      color="red"
      variant={theme.colorScheme === "light" ? "outline" : "light"}
      sx={{ border: "1.5px solid" }}
      onClick={onClick}
    >
      <IconTrash size={"1.25rem"} />
    </ActionIcon>
  );
};

export default DeleteActionIcon;
