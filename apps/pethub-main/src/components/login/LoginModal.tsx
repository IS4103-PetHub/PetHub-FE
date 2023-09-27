import {
  Container,
  useMantineTheme,
  Modal,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { ForgotPasswordPayload } from "shared-utils";
import { forgotPasswordService } from "@/api/userService";
import { AccountTypeEnum } from "@/types/constants";
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
  const [visible, setVisible] = useState(false);

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

  type LoginFormValues = typeof loginForm.values;
  type ForgotPasswordFormValues = typeof forgotPasswordForm.values;

  const handleLogin = async (values: LoginFormValues) => {
    setVisible(true);
    const res = await signIn("credentials", {
      callbackUrl: "/",
      redirect: false,
      email: values.email,
      password: values.password,
      accountType: values.accountType,
    });
    if (res?.error) {
      notifications.show({
        title: "Login Failed",
        message: "Invalid Credentials",
        color: "red",
        autoClose: 5000,
      });
      setVisible(false);
    } else {
      const session = await getSession();
      if (
        session &&
        session.user["accountType"] === AccountTypeEnum.PetBusiness
      ) {
        router.push("/business/dashboard");
      }
      close();
    }
    const timer = setTimeout(() => {
      loginForm.reset();
      setVisible(false);
    }, 800);
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
    >
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        loaderProps={{ color: "pink", type: "bars" }}
      />
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
