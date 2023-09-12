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
import { IconCheck, IconUser, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import React from "react";
import { useActivateAccount, useDeactivateAccount } from "@/hooks/account";
import { AccountStatusEnum } from "@/types/constants";

interface DeactivateReactivateAccountModalProps {
  userId: number;
  accountStatus: AccountStatusEnum;
  action: string;
  refetch(): void;
}

const DeactivateReactivateAccountModal = ({
  userId,
  accountStatus,
  action,
  refetch,
}: DeactivateReactivateAccountModalProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      password: "",
    },
  });

  const buttonColour = action === "Deactivate" ? "red" : "green";

  type FormValues = typeof form.values;

  const deactivateAccountMutation = useDeactivateAccount(queryClient);
  const reactivateAccountMutation = useActivateAccount(queryClient);

  const handleDeactivateAccount = async (values: FormValues) => {
    const payload = { userId: userId, password: values.password };
    try {
      await deactivateAccountMutation.mutateAsync(payload);
      notifications.show({
        title: "Account Deactivated",
        color: "green",
        icon: <IconCheck />,
        message: "Your profile and content is now hidden from others.",
      });
      refetch();
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
    close();
    form.reset();
  };

  const handleReactivateAccount = async (values: FormValues) => {
    const payload = { userId: userId, password: values.password };
    try {
      await reactivateAccountMutation.mutateAsync(payload);
      notifications.show({
        title: "Account Reactivated",
        color: "green",
        icon: <IconCheck />,
        message: "Your profile and content is now visible to others.",
      });
      refetch();
    } catch (error: any) {
      notifications.show({
        title: "Error Reactivating Account",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
    close();
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
          Are you sure you want to {action.toLowerCase()} your account?
        </Title>
        <Text mt="md">
          Please enter your account password for verification.
        </Text>
        <form
          onSubmit={form.onSubmit((values) =>
            action === "Deactivate"
              ? handleDeactivateAccount(values)
              : handleReactivateAccount(values),
          )}
        >
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
            <Button color={buttonColour} type="submit">
              {action}
            </Button>
          </Group>
        </form>
      </Modal>

      <Button
        color={buttonColour}
        leftIcon={<IconUser size="1rem" />}
        onClick={open}
      >
        {action} my account
      </Button>
    </>
  );
};

export default DeactivateReactivateAccountModal;