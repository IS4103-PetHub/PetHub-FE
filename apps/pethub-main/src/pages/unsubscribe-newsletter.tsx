import {
  Container,
  Paper,
  Title,
  Text,
  PasswordInput,
  Button,
  Stack,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { AxiosError } from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getErrorMessageProps, validatePassword } from "shared-utils";
import PasswordBar from "web-ui/shared/PasswordBar";
import { useUnsubscribeFromNewsletter } from "@/hooks/article";
import { parseRouterQueryParam } from "@/util";

export default function UnsubscribeNewsletter() {
  const router = useRouter();
  const email = parseRouterQueryParam(router.query.email);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const unsubscribeFromNewsletterMutation = useUnsubscribeFromNewsletter();

  const unsubscribeFromNewsletter = async () => {
    try {
      setIsLoading(true);
      await unsubscribeFromNewsletterMutation.mutateAsync(email);
      notifications.show({
        title: `Unsubscribed`,
        color: "green",
        icon: <IconCheck />,
        message:
          "You have successfully unsubscribed from the PetHub email newsletter.",
      });
      setIsLoading(false);
      setDone(true);
    } catch (error: any) {
      setIsLoading(false);
      notifications.show({
        ...getErrorMessageProps(`Error Unsubscribing`, error),
      });
    }
  };

  if (!email) router.push("/");

  return (
    <>
      <Head>
        <title>Unsubscribe - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Container size={420} mt={100}>
          <Title align="center">Unsubscribe From Newsletter</Title>
          {!done ? (
            <Text color="dimmed" size="sm" align="center" mt="sm">
              Are you sure you want to unsubscribe from the PetHub email
              newsletter?
            </Text>
          ) : (
            <Text color="dimmed" size="sm" align="center" mt="sm">
              You have unsubscribed from the PetHub email newsletter. We are
              sorry to see you go.
            </Text>
          )}
          <Group position="center" mt="xs">
            {!done ? (
              <Button onClick={unsubscribeFromNewsletter} loading={isLoading}>
                Unsubscribe
              </Button>
            ) : (
              <Button onClick={() => router.push("/")}>Home</Button>
            )}
          </Group>
        </Container>
      </Container>
    </>
  );
}
