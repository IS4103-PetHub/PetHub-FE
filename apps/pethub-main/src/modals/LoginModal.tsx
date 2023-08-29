import {
  Container,
  TextInput,
  PasswordInput,
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
import {
  IconArrowLeft,
  IconPawFilled,
  IconBuildingStore,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

// LoginBox Component
const LoginBox = ({
  loginForm,
  userType,
  setUserType,
  changeBoxToggle,
  handleLogin,
}) => (
  <div>
    <Title align="center">PetHub</Title>
    <Text color="dimmed" size="sm" align="center" mb="sm">
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
            value: "petOwner",
            label: (
              <Center>
                <IconPawFilled size="1rem" />
                <Box ml={10}>Pet Owner</Box>
              </Center>
            ),
          },
          {
            value: "petBusiness",
            label: (
              <Center>
                <IconBuildingStore size="1rem" />
                <Box ml={10}>Pet Business</Box>
              </Center>
            ),
          },
        ]}
      />
      <TextInput
        label="Email"
        required
        mt="xs"
        {...loginForm.getInputProps("email")}
      />
      <PasswordInput
        label="Password"
        required
        mt="xs"
        {...loginForm.getInputProps("password")}
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
      <Button mt="xs" type="submit" fullWidth mb="sm">
        Login
      </Button>
    </form>
  </div>
);

// ForgotPassword Box Component
const ForgotPasswordBox = ({
  forgotPasswordForm,
  toggle,
  handleForgotPassword,
  isForgotPasswordSuccessful,
}) => (
  <div>
    <Title align="center" fz="xl">
      Forgot your password?
    </Title>
    <Text c="dimmed" fz="sm" ta="center" mt="sm">
      Enter your email address to get a reset link if your email address is tied
      to an account in our system.
    </Text>
    {isForgotPasswordSuccessful ? (
      <Text c="dimmed" fz="md" ta="center">
        Password reset request successful. Please check your inbox.
      </Text>
    ) : (
      <form onSubmit={forgotPasswordForm.onSubmit(handleForgotPassword)}>
        <TextInput
          mt={20}
          label="Email"
          required
          {...forgotPasswordForm.getInputProps("email")}
        />
        <Group position="apart" mt="lg" mb="md">
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
);

interface LoginModalProps {
  opened: boolean;
  open: () => void;
  close: () => void;
}

// Main LoginModal Component
export const LoginModal = ({ opened, open, close }) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [type, toggle] = useToggle(["login", "forgotPassword"]);
  const [userType, setUserType] = useState("petOwner");
  const { data: session, status } = useSession();
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
        setUserType("petOwner");
        setIsForgotPasswordSuccessful(false);
      }, 800);
    }
  }, [opened]);

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
      type: "petOwner",
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
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email address"),
    },
  });

  const changeBoxToggle = () => {
    loginForm.reset();
    forgotPasswordForm.reset();
    toggle();
  };

  const handleLogin = async (event: any) => {
    const res = await signIn("credentials", {
      callbackUrl: "/",
      redirect: false,
      username: loginForm.values.email,
      password: loginForm.values.password,
      userType: userType,
    });
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
      close();
      userType === "petBusiness" ? router.push("/business/dashboard") : null;
    }
    const timer = setTimeout(() => {
      loginForm.reset();
    }, 800);
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordSuccessful(true); // replace with API response status
    const timer = setTimeout(() => {
      forgotPasswordForm.reset();
    }, 800);
  };

  return (
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
          <LoginBox
            loginForm={loginForm}
            userType={userType}
            setUserType={setUserType}
            changeBoxToggle={changeBoxToggle}
            handleLogin={handleLogin}
          />
        ) : (
          <ForgotPasswordBox
            forgotPasswordForm={forgotPasswordForm}
            toggle={toggle}
            handleForgotPassword={handleForgotPassword}
            isForgotPasswordSuccessful={isForgotPasswordSuccessful}
          />
        )}
      </Container>
    </Modal>
  );
};

{
  /* 

import {
  Container,
  TextInput,
  PasswordInput,
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
import { signIn, useSession } from "next-auth/react";

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
  const [userType, setUserType] = useState("petOwner");
  const { data: session, status } = useSession();
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
        setUserType("petOwner");
        setIsForgotPasswordSuccessful(false);
      }, 800);
    }
  }, [opened]);

  // Follow backend validation once ready
  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
      type: "petOwner",
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
    const res = await signIn("credentials", {
      callbackUrl: "/",
      redirect: false,
      username: loginForm.values.email,
      password: loginForm.values.password,
      userType: userType,
    });
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
      close();
      userType === "petBusiness" ? router.push("/business/dashboard") : null;
    }
    const timer = setTimeout(() => {
      loginForm.reset();
    }, 800);
  };

  const handleForgotPassword = () => {
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
            <div>
              <Title align="center">PetHub</Title>
              <Text color="dimmed" size="sm" align="center" mb="sm">
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
                      value: "petOwner",
                      label: (
                        <Center>
                          <IconPawFilled size="1rem" />
                          <Box ml={10}>Pet Owner</Box>
                        </Center>
                      ),
                    },
                    {
                      value: "petBusiness",
                      label: (
                        <Center>
                          <IconBuildingStore size="1rem" />
                          <Box ml={10}>Pet Business</Box>
                        </Center>
                      ),
                    },
                  ]}
                />
                <TextInput
                  label="Email"
                  required
                  mt="xs"
                  {...loginForm.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  required
                  mt="xs"
                  {...loginForm.getInputProps("password")}
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
                <Button mt="xs" type="submit" fullWidth mb="sm">
                  Login
                </Button>
              </form>
            </div>
          ) : (
            <div>
              <Title align="center" fz="xl">
                Forgot your password?
              </Title>
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
                    label="Email"
                    required
                    {...forgotPasswordForm.getInputProps("email")}
                  />
                  <Group position="apart" mt="lg" mb="md">
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
}; */
}
