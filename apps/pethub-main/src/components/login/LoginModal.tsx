import { Container, useMantineTheme, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { forgotPasswordService } from "@/api/userService";
import { AccountTypeEnum } from "@/types/constants";
import { ForgotPasswordPayload } from "@/types/types";
import { ForgotPasswordBox } from "./ForgotPasswordBox";
import { LoginBox } from "./LoginBox";

interface LoginModalProps {
  opened: boolean;
  open: () => void;
  close: () => void;
}

export const LoginModal = ({ opened, open, close }: LoginModalProps) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [type, toggle] = useToggle(["login", "forgotPassword"]);
  const [isForgotPasswordSuccessful, setIsForgotPasswordSuccessful] =
    useState(false);
  const [isSubmitButtonLoading, setIsSubmitButtonLoading] = useState(false);

  // Reset the entire modal (including forms, states etc) if it is closed and re-opened
  useEffect(() => {
    if (!opened) {
      // Let closing animation finish so it's not visible
      const timer = setTimeout(() => {
        loginForm.reset();
        forgotPasswordForm.reset();
        toggle("login");
        setIsForgotPasswordSuccessful(false);
        setIsSubmitButtonLoading(false);
      }, 800);
    }
  }, [opened]);

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
      accountType: AccountTypeEnum.PetOwner,
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
    forgotPasswordForm.reset();
    toggle();
  };

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      callbackUrl: "/",
      redirect: false,
      username: loginForm.values.email,
      password: loginForm.values.password,
      accountType: loginForm.values.accountType,
    });
    if (res?.error) {
      notifications.show({
        title: "Login Failed",
        message: "Invalid Credentials",
        color: "red",
        autoClose: 5000,
      });
    } else {
      const session = await getSession();
      if (
        session &&
        session.user["accountType"] === AccountTypeEnum.PetBusiness
      ) {
        router.push("/business/dashboard");
      }
      notifications.show({
        message: "Login Successful",
        color: "green",
        autoClose: 5000,
      });
      close();
    }
    const timer = setTimeout(() => {
      loginForm.reset();
    }, 800);
  };

  const handleForgotPassword = async () => {
    const forgotPasswordPayload: ForgotPasswordPayload = {
      email: forgotPasswordForm.values.email,
    };
    try {
      setIsSubmitButtonLoading(true);
      const res = await forgotPasswordService(forgotPasswordPayload);
      setIsForgotPasswordSuccessful(true);
    } catch (e) {
      notifications.show({
        message: "Invalid Email",
        color: "red",
        autoClose: 5000,
      });
    }
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
            changeBoxToggle={changeBoxToggle}
            handleLogin={handleLogin}
          />
        ) : (
          <ForgotPasswordBox
            forgotPasswordForm={forgotPasswordForm}
            toggle={toggle}
            handleForgotPassword={handleForgotPassword}
            isForgotPasswordSuccessful={isForgotPasswordSuccessful}
            isSubmitButtonLoading={isSubmitButtonLoading}
          />
        )}
      </Container>
    </Modal>
  );
};
