import { Stack, PasswordInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import PasswordBar from "web-ui/shared/PasswordBar";

const ChangePasswordForm = () => {
  const isMobile = useMediaQuery("(max-width: 64em)");
  const form = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      newPassword: (value) =>
        /^(?!.* )(?=.*\d)(?=.*[a-z]).{8,}$/.test(value)
          ? null
          : "Password must be at least 8 characters long with at least 1 letter, 1 number and no white spaces.",
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Passwords do not match." : null,
    },
  });
  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
      <Button type="submit">Save</Button>
    </form>
  );
};

export default ChangePasswordForm;
