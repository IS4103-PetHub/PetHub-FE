import { Modal, Title, Text, Button, Group, ButtonProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
import UpdateActionIcon from "./UpdateActionIcon";

interface UpdateActionButtonModalProps extends ButtonProps {
  title: string;
  subtitle: string;
  onUpdate(): void;
  large?: boolean;
}

const UpdateActionButtonModal = ({
  title,
  subtitle,
  onUpdate,
  large,
  ...props
}: UpdateActionButtonModalProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  function handleUpdate() {
    onUpdate();
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
          <Button color="red" type="submit" onClick={handleUpdate}>
            Update
          </Button>
        </Group>
      </Modal>

      {large ? (
        <Button leftIcon={<IconEdit size={"1rem"} />} onClick={open} {...props}>
          Update
        </Button>
      ) : (
        <UpdateActionIcon onClick={open} />
      )}
    </>
  );
};

export default UpdateActionButtonModal;
