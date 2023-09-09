import {
  Container,
  Accordion,
  Text,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { IconUser, IconKey, IconAlertOctagon } from "@tabler/icons-react";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import React from "react";
import { PageTitle } from "web-ui";
import AccountInfoForm from "@/components/account/AccountInfoForm";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import DeactivateAccountModal from "@/components/account/DeactivateAccountModal";
import { useGetPetBusinessByIdAndAccountType } from "@/hooks/pet-business";
import { useGetPetOwnerByIdAndAccountType } from "@/hooks/pet-owner";
import { AccountTypeEnum } from "@/types/constants";

interface MyAccountProps {
  userId: number;
  accountType: AccountTypeEnum;
}

export default function MyAccount({ userId, accountType }: MyAccountProps) {
  const theme = useMantineTheme();

  const defaultValues = ["account"];

  const { data: petOwner, refetch: refetchPetOwner } =
    useGetPetOwnerByIdAndAccountType(userId, accountType);
  const { data: petBusiness, refetch: refetchPetBusiness } =
    useGetPetBusinessByIdAndAccountType(userId, accountType);

  if (!petOwner && !petBusiness) {
    return null;
  }

  return (
    <Container mt="50px" mb="lg">
      <PageTitle title="My Account" />
      <Accordion
        variant="separated"
        mt="lg"
        multiple
        defaultValue={defaultValues}
      >
        <Accordion.Item value="account">
          <Accordion.Control>
            <Group>
              <IconUser color={theme.colors.indigo[5]} />
              <Text size="lg">Account information</Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel p="md">
            {petOwner ? (
              <AccountInfoForm petOwner={petOwner} refetch={refetchPetOwner} />
            ) : (
              <AccountInfoForm
                petBusiness={petBusiness}
                refetch={refetchPetBusiness}
              />
            )}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="password">
          <Accordion.Control>
            <Group>
              <IconKey color={theme.colors.indigo[5]} />
              <Text size="lg">Change password</Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel p="md">
            <ChangePasswordForm
              email={petOwner ? petOwner.email : petBusiness.email}
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="deactivate">
          <Accordion.Control>
            <Group>
              <IconAlertOctagon color={theme.colors.indigo[5]} />
              <Text size="lg">Deactivate account</Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel p="md">
            <DeactivateAccountModal
              userId={petOwner ? petOwner.userId : petBusiness.userId}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userId = session.user["userId"];
  const accountType = session.user["accountType"];

  return { props: { userId, accountType } };
}
