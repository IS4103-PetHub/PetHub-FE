import {
  ActionIcon,
  Button,
  Group,
  Popover,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";

interface DeleteActionButtonProps {
  onDelete(): void;
  itemName: string;
}

const DeleteActionButton = ({
  onDelete,
  itemName,
}: DeleteActionButtonProps) => {
  const [opened, setOpened] = useToggle();
  const theme = useMantineTheme();

  function handleDelete() {
    onDelete();
    setOpened(false);
  }

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      width={"200"}
      position="bottom"
      withArrow
      shadow="md"
      withinPortal
    >
      <Popover.Target>
        <ActionIcon
          size="lg"
          radius="md"
          color="red"
          variant={theme.colorScheme === "light" ? "outline" : "light"}
          sx={{ border: "1.5px solid" }}
          onClick={() => setOpened((o) => !o)}
        >
          <IconTrash size={"1.25rem"} />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <Text mb="xs">Delete {itemName}?</Text>
        <Group position="left">
          <Button size="xs" color="gray" onClick={() => setOpened(false)}>
            No
          </Button>
          <Button size="xs" color="red" onClick={handleDelete}>
            Yes
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};

export default DeleteActionButton;
