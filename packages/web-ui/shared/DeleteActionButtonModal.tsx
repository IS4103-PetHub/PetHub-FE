import { Modal, Title, Text, Button, Group, ButtonProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import React from "react";
import DeleteActionIcon from "./DeleteActionIcon";

interface DeleteActionButtonModalProps extends ButtonProps {
  title: string;
  subtitle: string;
  onDelete(): void;
  large?: boolean;
}

const DeleteActionButtonModal = ({
  title,
  subtitle,
  onDelete,
  large,
  ...props
}: DeleteActionButtonModalProps) => {
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
        <Title order={2}>{title}</Title>
        <Text mt="md">{subtitle}</Text>

        <Group mt="md" position="right">
          <Button type="reset" color="gray" onClick={close}>
            Cancel
          </Button>
          <Button color="red" type="submit" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>

      {large ? (
        <Button
          color="red"
          leftIcon={<IconTrash size={"1rem"} />}
          onClick={open}
          {...props}
        >
          Delete
        </Button>
      ) : (
        <DeleteActionIcon onClick={open} />
      )}
    </>
  );
};

export default DeleteActionButtonModal;
