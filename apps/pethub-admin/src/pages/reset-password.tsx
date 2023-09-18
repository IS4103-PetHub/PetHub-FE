import {
  Container,
  Paper,
  Title,
  Text,
  PasswordInput,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { ResetPasswordPayload, validatePassword } from "shared-utils";
import PasswordBar from "web-ui/shared/PasswordBar";
import { resetPasswordService } from "@/api/userService";
import { RegularButton } from "@/components/common/RegularButton";
import { parseRouterQueryParam } from "@/util";

export default function ResetPassword() {
  const router = useRouter();
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  /*
    Manually change the entire document body' background instead of just the component
    Move into global styles if desired
  */
  useEffect(() => {
    document.body.style.background =
      "linear-gradient(90deg, rgb(244, 244, 246) 0%, rgb(204, 204, 226), rgb(180, 180, 239) 100%)";
    return () => {
      document.body.style.background = "";
    };
  }, []);

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

  const handleGoToLogin = async () => {
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>Reset Password - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
                <RegularButton
                  text="Proceed to login page"
                  onClick={handleGoToLogin}
                />
              </Stack>
            ) : (
              <form onSubmit={form.onSubmit(handleResetPassword)}>
                <PasswordInput
                  label="New password"
                  required
                  mt="xs"
                  mb="xs"
                  {...form.getInputProps("password")}
                />
                <PasswordBar password={form.values.password} />
                <PasswordInput
                  label="Confirm new password"
                  required
                  mt="xs"
                  {...form.getInputProps("confirmPassword")}
                />
                <RegularButton
                  text="reset password"
                  mt="lg"
                  type="submit"
                  fullWidth
                />
              </form>
            )}
          </Paper>
        </Container>
      </Container>
    </>
  );
}
