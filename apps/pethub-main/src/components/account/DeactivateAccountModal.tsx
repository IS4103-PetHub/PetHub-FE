import {
  Button,
  Group,
  Modal,
  PasswordInput,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconUserX } from "@tabler/icons-react";
import React from "react";

const DeactivateAccountModal = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      password: "",
    },
  });

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
          Are you sure you want to deactivate your account?
        </Title>
        <Text mt="md">
          We are sad to say goodbye. Please enter your account password for
          verification.
        </Text>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <PasswordInput
            mt="md"
            placeholder="Enter your password"
            {...form.getInputProps("password")}
          />
          <Group mt="25px" position="right">
            <Button type="reset" color="gray" onClick={close}>
              Cancel
            </Button>
            <Button color="red" type="submit">
              Deactivate
            </Button>
          </Group>
        </form>
      </Modal>
      <Button color="red" leftIcon={<IconUserX size="1rem" />} onClick={open}>
        Deactivate my account
      </Button>
    </>
  );
};

export default DeactivateAccountModal;
