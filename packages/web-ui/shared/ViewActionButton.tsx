import { ActionIcon, useMantineTheme } from "@mantine/core";
import { IconListSearch } from "@tabler/icons-react";

interface ViewActionButtonProps {
  onClick(): void;
}

const ViewActionButton = ({ onClick }: ViewActionButtonProps) => {
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
      <IconListSearch size={"1.25rem"} />
    </ActionIcon>
  );
};

export default ViewActionButton;
