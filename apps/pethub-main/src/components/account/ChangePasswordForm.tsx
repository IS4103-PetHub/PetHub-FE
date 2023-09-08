import { Stack, PasswordInput, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import PasswordBar from "web-ui/shared/PasswordBar";
import { useChangePassword } from "@/hooks/account";
import { ChangePasswordPayload } from "@/types/types";
import { validateChangePassword, validatePassword } from "@/util";

interface ChangePasswordFormProps {
  email: string;
}

const ChangePasswordForm = ({ email }: ChangePasswordFormProps) => {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 64em)");
  const form = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      newPassword: (value, values) =>
        validateChangePassword(values.currentPassword, value),
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Passwords do not match." : null,
    },
  });

  type FormValues = typeof form.values;

  const changePasswordMutation = useChangePassword(queryClient);
  const changePassword = async (payload: ChangePasswordPayload) => {
    try {
      await changePasswordMutation.mutateAsync(payload);
      notifications.show({
        title: "Password Changed",
        color: "green",
        icon: <IconCheck />,
        message: `Password changed successfully!`,
      });
      form.reset();
    } catch (error: any) {
      notifications.show({
        title: "Error Changing Password",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
  };

  function handleSubmit(values: FormValues) {
    const payload: ChangePasswordPayload = {
      email: email,
      password: values.currentPassword,
      newPassword: values.newPassword,
    };
    changePassword(payload);
  }

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack w={isMobile ? "100%" : "50%"} spacing="xs" mb="md">
        <PasswordInput
          placeholder="Current password"
          label="Current password"
          {...form.getInputProps("currentPassword")}
        />
        <PasswordInput
          placeholder="New password"
          label="New password"
          {...form.getInputProps("newPassword")}
        />
        <PasswordBar password={form.values.newPassword} />
        <PasswordInput
          placeholder="Confirm password"
          label="Confirm password"
          {...form.getInputProps("confirmPassword")}
        />
      </Stack>
      <Group mt={25}>
        <Button
          display={form.isDirty() ? "block" : "none"}
          type="reset"
          color="gray"
          onClick={() => form.reset()}
        >
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
};

export default ChangePasswordForm;
