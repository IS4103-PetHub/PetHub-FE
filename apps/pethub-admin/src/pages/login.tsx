import {
  Container,
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Anchor,
  Text,
  Group,
  Center,
  Box,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import React, { useState } from "react";
import { RegularButton } from "@/components/buttons/RegularButton";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [type, toggle] = useToggle(["login", "forgotPassword"]);
  const [isForgotPasswordSuccessful, setIsForgotPasswordSuccessful] =
    useState(false);

  const loginForm = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (val) =>
        val.length <= 3
          ? "Username should include at least 3 characters"
          : null,
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const forgotPasswordForm = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email address"),
    },
  });

  const changeBoxToggle = () => {
    loginForm.reset();
    forgotPasswordForm.reset();
    toggle();
  };

  const handleLogin = async (event: any) => {
    console.log("Login values:", loginForm.values);
    const res = await signIn("credentials", {
      callbackUrl: "/",
      redirect: false,
      username: loginForm.values.username,
      password: loginForm.values.password,
    });
    loginForm.reset();
    if (res?.error) {
      console.log("Error loggin in!");
    } else {
      console.log("Login succecssful");
      router.push("/");
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password values:", forgotPasswordForm.values);
    forgotPasswordForm.reset();
    setIsForgotPasswordSuccessful(true); // replace with API response status
  };

  if (status === "authenticated") {
    router.push("/");
  }

  return (
    <Container fluid>
      {type === "login" ? (
        // LoginBox
        <Container size={420} mt={100}>
          <Title align="center">PetHub</Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Admin Management Portal
          </Text>
          <Paper withBorder shadow="sm" p={30} mt={30} radius="sm" c="blue">
            <form onSubmit={loginForm.onSubmit(handleLogin)}>
              <TextInput
                label="Username:"
                required
                mt="xs"
                value={loginForm.values.username}
                onChange={(event) =>
                  loginForm.setFieldValue("username", event.currentTarget.value)
                }
                error={loginForm.errors.username && "Invalid username"}
              />
              <PasswordInput
                label="Password:"
                required
                mt="xs"
                value={loginForm.values.password}
                onChange={(event) =>
                  loginForm.setFieldValue("password", event.currentTarget.value)
                }
                error={loginForm.errors.password && "Invalid password"}
              />
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                onClick={changeBoxToggle}
                size="xs"
                mt="sm"
              >
                {type === "login"
                  ? "Forgot your password?"
                  : "Already have an account? Login here"}
              </Anchor>
              <RegularButton text="Login" mt="xs" type="submit" fullWidth />
            </form>
          </Paper>
        </Container>
      ) : (
        // ForgotPassword Box
        <Container size={460} my={100}>
          <Title align="center">Forgot your password?</Title>
          <Text c="dimmed" fz="sm" ta="center" mt="sm">
            Enter your email address to get a reset link if your email address
            is tied to an account in our system.
          </Text>
          <Paper withBorder shadow="md" p={30} radius="sm" mt="xl">
            {isForgotPasswordSuccessful ? (
              <Text c="dimmed" fz="md" ta="center">
                Password reset request successful. Please check your inbox.
              </Text>
            ) : (
              <form
                onSubmit={forgotPasswordForm.onSubmit(handleForgotPassword)}
              >
                <TextInput
                  label="Email Address:"
                  required
                  value={forgotPasswordForm.values.email}
                  onChange={(event) =>
                    forgotPasswordForm.setFieldValue(
                      "email",
                      event.currentTarget.value,
                    )
                  }
                  error={
                    forgotPasswordForm.errors.email && "Invalid email address"
                  }
                />
                <Group position="apart" mt="lg">
                  <Anchor color="dimmed" size="sm">
                    <Center inline onClick={() => toggle()}>
                      <IconArrowLeft size={rem(12)} stroke={1.5} />
                      <Box ml={5}>Go back</Box>
                    </Center>
                  </Anchor>
                  <RegularButton text="Reset Password" type="submit" />
                </Group>
              </form>
            )}
          </Paper>
        </Container>
      )}
    </Container>
  );
}
