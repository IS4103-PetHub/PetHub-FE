import { ActionIcon, useMantineTheme } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";

interface EditActionButtonProps {
  onClick(): void;
}

const EditActionButton = ({ onClick }: EditActionButtonProps) => {
  const theme = useMantineTheme();

  return (
    <ActionIcon
      size="lg"
      radius="md"
      color={theme.primaryColor}
      variant={theme.colorScheme === "light" ? "outline" : "light"}
      sx={{ border: "1.5px solid" }}
      onClick={onClick}
    >
      <IconPencil size={"1.25rem"} />
    </ActionIcon>
  );
};

export default EditActionButton;
