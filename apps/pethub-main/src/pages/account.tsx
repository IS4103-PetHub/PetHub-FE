import {
  Container,
  Accordion,
  Text,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { IconUser, IconKey, IconAlertOctagon } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import React from "react";
import { PageTitle } from "web-ui";
import AccountInfoForm from "@/components/account/AccountInfoForm";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import DeactivateAccountModal from "@/components/account/DeactivateAccountModal";
import { AccountTypeEnum } from "@/types/constants";
import { PetBusinessAccount, PetOwnerAccount } from "@/types/types";

interface MyAccountProps {
  petOwner?: PetOwnerAccount;
  petBusiness?: PetBusinessAccount;
}

export default function MyAccount({ petOwner, petBusiness }: MyAccountProps) {
  const theme = useMantineTheme();
  const defaultValues = ["account"];

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
              <AccountInfoForm petOwner={petOwner} />
            ) : (
              <AccountInfoForm petBusiness={petBusiness} />
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
            <DeactivateAccountModal />
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

  if (accountType === AccountTypeEnum.PetOwner) {
    const data = await (
      await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/pet-owners/${userId}`,
      )
    ).data;
    const petOwner: PetOwnerAccount = {
      userId: userId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      contactNumber: data.contactNumber,
      email: data.user.email,
      accountType: accountType,
      accountStatus: data.user.accountStatus,
      dateCreated: data.user.dateCreated,
    };
    return { props: { petOwner: petOwner } };
  } else if (accountType === AccountTypeEnum.PetBusiness) {
    const data = await (
      await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/pet-businesses/${userId}`,
      )
    ).data;
    const petBusiness: PetBusinessAccount = {
      userId: userId,
      companyName: data.companyName,
      uen: data.uen,
      businessType: data.businessType,
      businessDescription: data.businessDescription,
      websiteURL: data.websiteURL,
      contactNumber: data.contactNumber,
      email: data.user.email,
      accountType: accountType,
      accountStatus: data.user.accountStatus,
      dateCreated: data.user.dateCreated,
    };
    return { props: { petBusiness: petBusiness } };
  }
}
