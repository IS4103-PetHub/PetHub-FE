import { Button, Group, Popover, Text, useMantineTheme } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import DeleteActionIcon from "./DeleteActionIcon";

interface SimpleDeleteActionButtonProps {
  onDelete(): void;
  itemName: string;
}

const SimpleDeleteActionButton = ({
  onDelete,
  itemName,
}: SimpleDeleteActionButtonProps) => {
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
        <DeleteActionIcon onClick={() => setOpened((o) => !o)} />
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

export default SimpleDeleteActionButton;
