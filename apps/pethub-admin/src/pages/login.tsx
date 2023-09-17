import { Container, Paper, Title, Text, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { ForgotPasswordPayload } from "shared-utils";
import { forgotPasswordService } from "@/api/userService";
import { ForgotPasswordBox } from "@/components/login/ForgotPasswordBox";
import { LoginBox } from "@/components/login/LoginBox";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [type, toggle] = useToggle(["login", "forgotPassword"]);
  const [isForgotPasswordSuccessful, setIsForgotPasswordSuccessful] =
    useState(false);
  const [isSubmitButtonLoading, setIsSubmitButtonLoading] = useState(false);

  if (session) {
    router.push("/");
  }

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

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (val) =>
        val.length > 512
          ? "The input exceeds the character limit of 512."
          : null,
      password: (val) =>
        val.length > 512
          ? "The input exceeds the character limit of 512."
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
          return "The input exceeds the character limit of 512.";
        }
        if (!/^\S+@\S+$/.test(val)) {
          return "Invalid email address.";
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

  type LoginFormValues = typeof loginForm.values;
  type ForgotPasswordFormValues = typeof forgotPasswordForm.values;

  const handleLogin = async (values: LoginFormValues) => {
    const res = await signIn("credentials", {
      callbackUrl: "/",
      redirect: false,
      email: values.email,
      password: values.password,
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

  const handleForgotPassword = async (values: ForgotPasswordFormValues) => {
    const forgotPasswordPayload: ForgotPasswordPayload = {
      email: forgotPasswordForm.values.email,
    };
    try {
      setIsSubmitButtonLoading(true);
      await forgotPasswordService(forgotPasswordPayload);
      setIsForgotPasswordSuccessful(true);
    } catch (e: AxiosError | any) {
      setIsSubmitButtonLoading(false);
      notifications.show({
        message:
          (e.response && e.response.data && e.response.data.message) ||
          e.message,
        color: "red",
        autoClose: 5000,
      });
    }
  };

  return (
    status !== "authenticated" && (
      <Container fluid>
        {type === "login" ? (
          <div className="center-vertically">
            <Box>
              <Title align="center">PetHub</Title>
              <Text size="md" align="center" mt={5}>
                Admin Management Portal
              </Text>
              <Paper
                withBorder
                shadow="sm"
                p={30}
                mt={30}
                radius="sm"
                w="460px"
              >
                <LoginBox
                  changeBoxToggle={changeBoxToggle}
                  loginForm={loginForm}
                  handleLogin={handleLogin}
                />
              </Paper>
            </Box>
          </div>
        ) : (
          <Container size={460}>
            <div className="center-vertically">
              <Box>
                <Title align="center">Forgot your password?</Title>
                <Text fz="sm" ta="center" mt="sm">
                  Enter your email address to get a reset link if your email
                  address is tied to an account in our system.
                </Text>
                <Paper
                  withBorder
                  shadow="md"
                  p={30}
                  radius="sm"
                  mt="xl"
                  w="460px"
                >
                  <ForgotPasswordBox
                    changeBoxToggle={changeBoxToggle}
                    isForgotPasswordSuccessful={isForgotPasswordSuccessful}
                    forgotPasswordForm={forgotPasswordForm}
                    handleForgotPassword={handleForgotPassword}
                    isSubmitButtonLoading={isSubmitButtonLoading}
                  />
                </Paper>
              </Box>
            </div>
          </Container>
        )}
      </Container>
    )
  );
}
