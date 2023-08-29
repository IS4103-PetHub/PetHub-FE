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
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { RegularButton } from "@/components/buttons/RegularButton";

const LoginBox = ({ changeBoxToggle, loginForm, handleLogin }: any) => {
  return (
    <form onSubmit={loginForm.onSubmit(handleLogin)}>
      <TextInput
        label="Email"
        required
        mt="xs"
        value={loginForm.values.email}
        onChange={(event) =>
          loginForm.setFieldValue("email", event.currentTarget.value)
        }
        error={loginForm.errors.email}
      />
      <PasswordInput
        label="Password"
        required
        mt="xs"
        value={loginForm.values.password}
        onChange={(event) =>
          loginForm.setFieldValue("password", event.currentTarget.value)
        }
        error={loginForm.errors.password}
      />
      <Anchor
        component="button"
        type="button"
        color="dimmed"
        onClick={changeBoxToggle}
        size="xs"
        mt="sm"
      >
        Forgot your password?
      </Anchor>
      <RegularButton text="Login" mt="xs" type="submit" fullWidth />
    </form>
  );
};

const ForgotPasswordBox = ({
  changeBoxToggle,
  isForgotPasswordSuccessful,
  forgotPasswordForm,
  handleForgotPassword,
}: any) => {
  return isForgotPasswordSuccessful ? (
    <Text c="dimmed" fz="md" ta="center">
      Password reset request successful. Please check your inbox.
    </Text>
  ) : (
    <form onSubmit={forgotPasswordForm.onSubmit(handleForgotPassword)}>
      <TextInput
        label="Email"
        required
        value={forgotPasswordForm.values.email}
        onChange={(event) =>
          forgotPasswordForm.setFieldValue("email", event.currentTarget.value)
        }
        error={forgotPasswordForm.errors.email}
      />
      <Group position="apart" mt="lg">
        <Anchor color="dimmed" size="sm">
          <Center inline onClick={changeBoxToggle}>
            <IconArrowLeft size={rem(12)} stroke={1.5} />
            <Box ml={5}>Go back</Box>
          </Center>
        </Anchor>
        <RegularButton text="Reset Password" type="submit" />
      </Group>
    </form>
  );
};

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [type, toggle] = useToggle(["login", "forgotPassword"]);
  const [isForgotPasswordSuccessful, setIsForgotPasswordSuccessful] =
    useState(false);

  if (session) {
    router.push("/");
  }

  useEffect(() => {
    document.body.style.background =
      "linear-gradient(90deg, rgb(244, 244, 246) 0%, rgb(204, 204, 226), rgb(180, 180, 239) 100%)";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (val) =>
        val.length > 512
          ? "The input exceeds the character limit of 512"
          : null,
      password: (val) =>
        val.length > 512
          ? "The input exceeds the character limit of 512"
          : null,
    },
  });

  const forgotPasswordForm = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (val) => {
        if (val.length > 512) {
          return "The input exceeds the character limit of 512";
        }
        if (!/^\S+@\S+$/.test(val)) {
          return "Invalid email address";
        }
        return null;
      },
    },
  });

  const changeBoxToggle = () => {
    loginForm.reset();
    forgotPasswordForm.reset();
    toggle();
  };

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      callbackUrl: "/",
      redirect: false,
      email: loginForm.values.email,
      password: loginForm.values.password,
    });
    loginForm.reset();
    if (res?.error) {
      notifications.show({
        title: "Login Failed",
        message: "Invalid Credentials",
        color: "red",
        autoClose: 5000,
      });
    } else {
      notifications.show({
        message: "Login Successful",
        color: "green",
        autoClose: 5000,
      });
      router.push("/");
    }
  };

  const handleForgotPassword = () => {
    forgotPasswordForm.reset();
    setIsForgotPasswordSuccessful(true); // replace with API response status
  };

  return (
    <Container fluid>
      {type === "login" ? (
        <Container size={420} mt={100}>
          <Title align="center">PetHub</Title>
          <Text color="dark" size="sm" align="center" mt={5}>
            Admin Management Portal
          </Text>
          <Paper withBorder shadow="sm" p={30} mt={30} radius="sm" c="blue">
            <LoginBox
              changeBoxToggle={changeBoxToggle}
              loginForm={loginForm}
              handleLogin={handleLogin}
            />
          </Paper>
        </Container>
      ) : (
        <Container size={460} my={100}>
          <Title align="center">Forgot your password?</Title>
          <Text c="dimmed" fz="sm" ta="center" mt="sm">
            Enter your email address to get a reset link if your email address
            is tied to an account in our system.
          </Text>
          <Paper withBorder shadow="md" p={30} radius="sm" mt="xl">
            <ForgotPasswordBox
              changeBoxToggle={changeBoxToggle}
              isForgotPasswordSuccessful={isForgotPasswordSuccessful}
              forgotPasswordForm={forgotPasswordForm}
              handleForgotPassword={handleForgotPassword}
            />
          </Paper>
        </Container>
      )}
    </Container>
  );
}
