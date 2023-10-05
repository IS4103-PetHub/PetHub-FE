import { ActionIcon, useMantineTheme, ActionIconProps } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import React from "react";

interface UpdateActionIconProps extends ActionIconProps {
  onClick(): void;
}
const UpdateActionIcon = ({ onClick, ...props }: UpdateActionIconProps) => {
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
      <IconEdit size={"1.25rem"} />
    </ActionIcon>
  );
};

export default UpdateActionIcon;
