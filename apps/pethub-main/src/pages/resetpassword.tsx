import {
  Container,
  Paper,
  Title,
  Text,
  PasswordInput,
  Anchor,
  Button,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { resetPasswordService } from "@/api/userService";
import { ResetPasswordPayload } from "@/types/types";
import { parseRouterQueryParam, validatePassword } from "@/util";

export default function Login() {
  const router = useRouter();
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  const form = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: validatePassword,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleResetPassword = async () => {
    // Get the token out of the URL and attempt API call
    console.log("The reset password token is", router.query.token);
    const resetPasswordPayload: ResetPasswordPayload = {
      token: parseRouterQueryParam(router.query.token),
      newPassword: form.values.password,
    };
    try {
      await resetPasswordService(resetPasswordPayload);
      setIsResetSuccessful(true);
    } catch (e: AxiosError | any) {
      notifications.show({
        message:
          (e.response && e.response.data && e.response.data.message) ||
          e.message,
        color: "red",
        autoClose: 5000,
      });
    }
  };

  const handleGoToHome = async () => {
    router.push("/");
  };

  return (
    <Container fluid>
      <Container size={420} mt={100}>
        <Title align="center">Reset your password</Title>
        <Text color="dark" size="sm" align="center" mt={5}>
          You have requested to reset your password. Please enter your new
          password below.
        </Text>
        <Paper withBorder shadow="sm" p={30} mt={30} radius="sm" c="blue">
          {isResetSuccessful ? (
            <Stack>
              <Text c="dimmed" fz="md" ta="center">
                Password reset successful.
              </Text>
              <Anchor
                component="button"
                type="button"
                color="blue"
                onClick={handleGoToHome}
                size="lg"
              >
                Proceed to Home page
              </Anchor>
            </Stack>
          ) : (
            <form onSubmit={form.onSubmit(handleResetPassword)}>
              <PasswordInput
                label="New password"
                required
                mt="xs"
                {...form.getInputProps("password")}
              />
              <PasswordInput
                label="Confirm new password"
                required
                mt="xs"
                {...form.getInputProps("confirmPassword")}
              />
              <Button mt="lg" type="submit" fullWidth>
                Reset Password
              </Button>
            </form>
          )}
        </Paper>
      </Container>
    </Container>
  );
}
