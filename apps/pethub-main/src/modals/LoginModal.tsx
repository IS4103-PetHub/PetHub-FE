import {
  Container,
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Anchor,
  Text,
  useMantineTheme,
  Group,
  Center,
  Box,
  Modal,
  SegmentedControl,
  Button,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { IconPawFilled, IconBuildingStore } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import React, { useState, useEffect } from "react";

interface LoginModalProps {
  opened: boolean;
  open: () => void;
  close: () => void;
}

export const LoginModal = ({ opened, open, close }: LoginModalProps) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [type, toggle] = useToggle(["login", "forgotPassword"]);
  const [userType, setUserType] = useState("PO");
  const [isForgotPasswordSuccessful, setIsForgotPasswordSuccessful] =
    useState(false);

  // Reset the entire modal (including forms, states etc) if it is closed and re-opened
  useEffect(() => {
    if (!opened) {
      // Let closing animation finish so it's not visible
      const timer = setTimeout(() => {
        loginForm.reset();
        forgotPasswordForm.reset();
        toggle("login");
        setUserType("PO");
        setIsForgotPasswordSuccessful(false);
      }, 800);
    }
  }, [opened]);

  // Follow backend validation once ready
  const loginForm = useForm({
    initialValues: {
      username: "",
      password: "",
      type: "owner",
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

  // Follow backend validation once ready
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
    if (res?.error) {
      notifications.show({
        title: "Login Failed",
        message: "Placeholder for API response",
        color: "red",
        autoClose: 5000,
      });
    } else {
      notifications.show({
        title: "Login Successful",
        message: "You are currently logged in as <role from API response>",
        color: "green",
        autoClose: 5000,
      });
      close();
      router.push("/");
    }
    const timer = setTimeout(() => {
      loginForm.reset();
    }, 800);
  };

  const handleForgotPassword = () => {
    console.log("Forgot password values:", forgotPasswordForm.values);
    setIsForgotPasswordSuccessful(true); // replace with API response status
    const timer = setTimeout(() => {
      forgotPasswordForm.reset();
    }, 800);
  };

  return (
    <>
      <Modal
        centered
        size="md"
        overlayProps={{
          color:
            theme.colorScheme === "light"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
        opened={opened}
        onClose={close}
        transitionProps={{
          transition: "fade",
          duration: 600,
          timingFunction: "linear",
        }}
      >
        <Container fluid>
          {type === "login" ? (
            // LoginBox
            <div>
              <Title align="center">PetHub</Title>
              <Text color="dimmed" size="sm" align="center">
                Welcome to PetHub. Login now!
              </Text>

              <form onSubmit={loginForm.onSubmit(handleLogin)}>
                <SegmentedControl
                  fullWidth
                  color="dark"
                  onChange={(val) => {
                    setUserType(val);
                    loginForm.setFieldValue("type", val);
                  }}
                  value={userType}
                  data={[
                    {
                      value: "PO",
                      label: (
                        <Center>
                          <IconPawFilled />
                          <Box ml={10}>Pet Owner</Box>
                        </Center>
                      ),
                    },
                    {
                      value: "PB",
                      label: (
                        <Center>
                          <IconBuildingStore />
                          <Box ml={10}>Pet Business</Box>
                        </Center>
                      ),
                    },
                  ]}
                />
                <TextInput
                  label="Username:"
                  required
                  mt="xs"
                  value={loginForm.values.username}
                  onChange={(event) =>
                    loginForm.setFieldValue(
                      "username",
                      event.currentTarget.value,
                    )
                  }
                  error={loginForm.errors.username && "Invalid username"}
                />
                <PasswordInput
                  label="Password:"
                  required
                  mt="xs"
                  value={loginForm.values.password}
                  onChange={(event) =>
                    loginForm.setFieldValue(
                      "password",
                      event.currentTarget.value,
                    )
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
                <Button mt="xs" type="submit" fullWidth>
                  Login
                </Button>
              </form>
            </div>
          ) : (
            // ForgotPassword Box
            <div>
              <Title align="center">Forgot your password?</Title>
              <Text c="dimmed" fz="sm" ta="center" mt="sm">
                Enter your email address to get a reset link if your email
                address is tied to an account in our system.
              </Text>

              {isForgotPasswordSuccessful ? (
                <Text c="dimmed" fz="md" ta="center">
                  Password reset request successful. Please check your inbox.
                </Text>
              ) : (
                <form
                  onSubmit={forgotPasswordForm.onSubmit(handleForgotPassword)}
                >
                  <TextInput
                    mt={20}
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
                    <Button type="submit">Reset Password</Button>
                  </Group>
                </form>
              )}
            </div>
          )}
        </Container>
      </Modal>
    </>
  );
};
