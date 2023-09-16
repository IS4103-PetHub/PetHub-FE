import { Modal, Title, Group, Button, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import React from "react";

interface RemoveUserFromGroupButtonProps {
  userName: string;
  groupName: string;
  onDelete(): void;
}
const RemoveUserFromGroupButton = ({
  userName,
  groupName,
  onDelete,
}: RemoveUserFromGroupButtonProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  function handleDelete() {
    onDelete();
    close();
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        centered
        padding="1.5rem"
        size="md"
      >
        <Title order={2}>
          {`Are you sure you want to remove ${userName} from this group?`}
        </Title>
        <Text mt="md">
          {`This user will be unassigned from ${groupName} and lose any
          associated permissions.`}
        </Text>

        <Group mt="md" position="right">
          <Button type="reset" color="gray" onClick={close}>
            Cancel
          </Button>
          <Button color="red" type="submit" onClick={handleDelete}>
            Remove
          </Button>
        </Group>
      </Modal>
      <Button
        sx={{ border: "1.25px solid red" }}
        size="xs"
        leftIcon={<IconTrash size="1rem" />}
        variant="light"
        color="red"
        onClick={open}
      >
        Remove
      </Button>
    </>
  );
};

export default RemoveUserFromGroupButton;
