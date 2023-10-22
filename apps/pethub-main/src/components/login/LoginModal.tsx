import { Container, useMantineTheme, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AxiosError, all } from "axios";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import { parseCookies } from "nookies";
import React, { useState, useEffect } from "react";
import { ForgotPasswordPayload, getErrorMessageProps } from "shared-utils";
import { AccountTypeEnum } from "shared-utils";
import { useLoadingOverlay } from "web-ui/shared/LoadingOverlayContext";
import { forgotPasswordService } from "@/api/userService";
import { allowedRoutesAfterLogin } from "@/types/constants";
import { ForgotPasswordBox } from "./ForgotPasswordBox";
import LoginBox from "./LoginBox";

interface LoginModalProps {
  opened: boolean;
  open: () => void;
  close: () => void;
}

const LoginModal = ({ opened, open, close }: LoginModalProps) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [type, toggle] = useToggle(["login", "forgotPassword"]);
  const [isForgotPasswordSuccessful, setIsForgotPasswordSuccessful] =
    useState(false);
  const [isSubmitButtonLoading, setIsSubmitButtonLoading] = useState(false);
  const { showOverlay, hideOverlay } = useLoadingOverlay();

  const cookies = parseCookies();
  const originalPath = cookies.originalPath || "/";

  useEffect(() => {
    const html = document.documentElement;
    if (opened) {
      html.style.overflowY = "hidden";
    } else {
      html.style.overflowY = "";
    }
    return () => {
      html.style.overflowY = "";
    };
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
    const res = await signIn("credentials", {
      callbackUrl: originalPath,
      redirect: false,
      email: values.email,
      password: values.password,
      accountType: values.accountType,
    });
    if (res?.error) {
      notifications.show({
        title: "Login Failed",
        message: res?.error,
        color: "red",
      });
    } else {
      const session = await getSession();
      if (
        session &&
        session.user["accountType"] === AccountTypeEnum.PetBusiness
      ) {
        showOverlay();
        if (allowedRoutesAfterLogin.includes(originalPath)) {
          router.push(originalPath);
        } else {
          router.push("/business/dashboard");
        }
      }
      if (allowedRoutesAfterLogin.includes(originalPath)) {
        router.push(originalPath);
      }
    }
    close();
    const timer = setTimeout(() => {
      loginForm.reset();
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
        ...getErrorMessageProps("Error Encountered", e),
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

export default LoginModal;
