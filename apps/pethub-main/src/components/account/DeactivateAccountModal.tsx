import {
  Button,
  Group,
  Modal,
  PasswordInput,
  Text,
  Title,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconUserX, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import React from "react";
import { useDeactivateAccount } from "@/hooks/account";

interface DeactivateAccountModalProps {
  userId: number;
}

const DeactivateAccountModal = ({ userId }: DeactivateAccountModalProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      password: "",
    },
  });

  type FormValues = typeof form.values;

  const deactivateAccountMutation = useDeactivateAccount(queryClient);

  const handleSubmit = async (values: FormValues) => {
    const payload = { userId: userId, password: values.password };
    try {
      await deactivateAccountMutation.mutateAsync(payload);
      notifications.show({
        title: "Account Deactivated",
        color: "green",
        loading: true,
        message:
          "Pet business account deactivated successfully. Redirecting back to home page...",
      });
      signOut({
        callbackUrl: "/",
      });
    } catch (error: any) {
      notifications.show({
        title: "Error Deactivating Account",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
    form.reset();
  };

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
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <PasswordInput
            mt="md"
            required
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
