import {
  Container,
  Accordion,
  Text,
  Group,
  useMantineTheme,
  Button,
} from "@mantine/core";
import {
  IconUser,
  IconKey,
  IconUserX,
  IconAlertOctagon,
} from "@tabler/icons-react";
import React from "react";
import { PageTitle } from "web-ui";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import PersonalInfoForm from "@/components/account/PersonalInfoForm";

export default function MyAccount() {
  const theme = useMantineTheme();
  const accordionItems = [
    { value: "personal", label: "Personal information" },
    { value: "password", label: "Change password" },
    { value: "deactivate", label: "Deactivate account" },
  ];

  return (
    <Container mt="lg">
      <PageTitle title="My Account" />
      <Accordion mt="lg" multiple defaultValue={["personal"]}>
        <Accordion.Item value={accordionItems[0].value}>
          <Accordion.Control>
            <Group>
              <IconUser color={theme.colors.indigo[5]} />
              <Text size="lg">{accordionItems[0].label}</Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <PersonalInfoForm />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value={accordionItems[1].value}>
          <Accordion.Control>
            <Group>
              <IconKey color={theme.colors.indigo[5]} />
              <Text size="lg">{accordionItems[1].label}</Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <ChangePasswordForm />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value={accordionItems[2].value}>
          <Accordion.Control>
            <Group>
              <IconAlertOctagon color={theme.colors.indigo[5]} />
              <Text size="lg">{accordionItems[2].label}</Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Button color="red" leftIcon={<IconUserX size="1rem" />}>
              Deactivate your account
            </Button>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
