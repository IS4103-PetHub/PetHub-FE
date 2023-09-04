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
import DeactivateAccountModal from "@/components/account/DeactivateAccountModal";
import PersonalInfoForm from "@/components/account/PersonalInfoForm";
import { AccountTypeEnum } from "@/types/constants";
import { UserAccount } from "@/types/types";

const mockUser: UserAccount = {
  accountId: "123124125",
  accountType: AccountTypeEnum.PetOwner,
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: new Date("12/30/2000").toISOString(),
  contactNumber: "91234567",
  email: "john@gmail.com",
};

export default function MyAccount() {
  const theme = useMantineTheme();
  const accordionItems = [
    { value: "personal", label: "Personal information" },
    { value: "password", label: "Change password" },
    { value: "deactivate", label: "Deactivate account" },
  ];

  return (
    <Container mt="lg" mb="lg">
      <PageTitle title="My Account" />
      <Accordion
        variant="separated"
        mt="lg"
        multiple
        defaultValue={["personal"]}
      >
        <Accordion.Item value={accordionItems[0].value}>
          <Accordion.Control>
            <Group>
              <IconUser color={theme.colors.indigo[5]} />
              <Text size="lg">{accordionItems[0].label}</Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel p="md">
            <PersonalInfoForm user={mockUser} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value={accordionItems[1].value}>
          <Accordion.Control>
            <Group>
              <IconKey color={theme.colors.indigo[5]} />
              <Text size="lg">{accordionItems[1].label}</Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel p="md">
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
          <Accordion.Panel p="md">
            <DeactivateAccountModal />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
