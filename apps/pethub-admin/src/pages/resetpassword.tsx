import {
  Container,
  Paper,
  Title,
  Text,
  PasswordInput,
  Anchor,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { RegularButton } from "@/components/common/RegularButton";
import { validatePassword } from "@/util";

export default function Login() {
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
      confirmPassword: validatePassword,
    },
  });

  const handleResetPassword = async () => {
    if (form.values.password !== form.values.confirmPassword) {
      notifications.show({
        message: "Passwords do not match",
        color: "red",
        autoClose: 5000,
      });
      form.reset();
    } else {
      // Get the token out of the URL and attempt API call
      let token = router.query.token;
      console.log("The reset password token is", token);
      setIsResetSuccessful(true);
    }
  };

  const handleGoToLogin = async () => {
    router.push("/login");
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
                onClick={handleGoToLogin}
                size="lg"
              >
                Proceed to login page
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
  );
}
