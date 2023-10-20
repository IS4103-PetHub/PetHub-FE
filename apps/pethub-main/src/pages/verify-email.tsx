import {
  Container,
  Box,
  Center,
  Badge,
  Group,
  Button,
  useMantineTheme,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCircleCheck,
  IconChevronsRight,
  IconCheck,
} from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getErrorMessageProps } from "shared-utils";
import { resendVerifyEmail, verifyEmail } from "@/api/userService";
import { parseRouterQueryParam } from "@/util";

export default function VerifyEmail() {
  const theme = useMantineTheme();
  const router = useRouter();
  const token = parseRouterQueryParam(router.query.token);
  const email = parseRouterQueryParam(router.query.email);
  const [isVerifyEmail, setIsVerifyEamil] = useState(false);

  // To set it as send email page or verify email page
  useEffect(() => {
    if (token) setIsVerifyEamil(true);
    else setIsVerifyEamil(false);
  }, [token]);

  const handleVerifyPassword = async () => {
    try {
      await verifyEmail({ token });
      notifications.show({
        title: "Account Verified",
        color: "green",
        icon: <IconCheck />,
        message: `Account successfully verified!`,
      });
      router.push(`/`);
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error verifying email", error),
      });
    }
  };

  const handleResendEmail = async () => {
    try {
      await resendVerifyEmail({ email });
      notifications.show({
        title: "Email sent",
        color: "green",
        icon: <IconCheck />,
        message: `Email verification sent successfully!`,
      });
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error resending email", error),
      });
    }
  };

  const handleGoToLogin = async () => {
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Verify your email address - PetHub</title>
        <meta name="description" content="PetHub Main Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid className="center-vertically">
        <Box>
          <Center mb={15}>
            <IconCircleCheck
              size={80}
              color={theme.colors.lime[5]}
              strokeWidth="1.5"
            />
          </Center>
          <Text
            size="xl"
            weight={500}
            color={theme.colors.dark[7]}
            align="center"
            mb={10}
          >
            Verify your email address
          </Text>
          <Center mb="lg" />
          <Text size="md" color="dimmed" align="center" w="42vw">
            {isVerifyEmail
              ? `Thank you for registering with PetHub! We strongly recommend you to follow the 
                        process below and sign in to verify and release messages to your mail box.
                        
                        To make your PetHub account more secure and to receive important messages and transaction 
                        history from PetHub, Kindly use the button below to verify your email address. A confirmation message 
                        appear subsequently.`
              : `Thank you for registering with PetHub! We've sent a verification link to your email
                        address. Please check your email and click the link to confirm your email 
                        and activate your account. Once you've verified your email, you'll have 
                        full access to PetHub's features. If you haven't received the email, please 
                        check your spam folder. The link would expire in 15 minutes. If you have yet to receive the email or the link 
                        has expired, click on the Resend Email.`}
          </Text>
          <Group position="center" mt={35}>
            {isVerifyEmail && (
              <Button
                size="md"
                color="dark"
                variant="default"
                onClick={() => handleVerifyPassword()}
              >
                Verify your account
              </Button>
            )}
            {!isVerifyEmail && (
              <Button
                size="md"
                color="dark"
                variant="default"
                onClick={() => handleResendEmail()}
              >
                Resend Email
              </Button>
            )}
          </Group>
        </Box>
      </Container>
    </>
  );
}
