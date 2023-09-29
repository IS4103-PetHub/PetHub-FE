import {
  Container,
  Accordion,
  Text,
  Group,
  useMantineTheme,
} from "@mantine/core";
import {
  IconUser,
  IconKey,
  IconAlertOctagon,
  IconAddressBook,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { getSession } from "next-auth/react";
import React from "react";
import { formatISODateString } from "shared-utils";
import { AccountStatusEnum, AccountTypeEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import AccountStatusBadge from "web-ui/shared/AccountStatusBadge";
import ChangePasswordForm from "web-ui/shared/ChangePasswordForm";
import AccountInfoForm from "@/components/account/AccountInfoForm";
import AddressInfoForm from "@/components/account/AddressInfoForm";
import DeactivateReactivateAccountModal from "@/components/account/DeactivateReactivateAccountModal";
import { useGetPetBusinessByIdAndAccountType } from "@/hooks/pet-business";
import { useGetPetOwnerByIdAndAccountType } from "@/hooks/pet-owner";

interface MyAccountProps {
  userId: number;
  accountType: AccountTypeEnum;
}

export default function MyAccount({ userId, accountType }: MyAccountProps) {
  const theme = useMantineTheme();
  const queryClient = useQueryClient();

  const defaultValues = ["account"];

  const { data: petOwner, refetch: refetchPetOwner } =
    useGetPetOwnerByIdAndAccountType(userId, accountType);
  const { data: petBusiness, refetch: refetchPetBusiness } =
    useGetPetBusinessByIdAndAccountType(userId, accountType);

  if (!petOwner && !petBusiness) {
    return null;
  }
  const accountStatus = petOwner
    ? petOwner.accountStatus
    : petBusiness.accountStatus;

  // to determine to show deactivate or reactivate
  const action =
    accountStatus === AccountStatusEnum.Active ? "Deactivate" : " Reactivate";

  const dateCreated = formatISODateString(
    petOwner ? petOwner.dateCreated : petBusiness.dateCreated,
  );

  // Determine if deactivate/reactivate button should be shown for clarity
  const checkDisplayDeactivateReactivate = () => {
    if (accountStatus === AccountStatusEnum.Active) {
      return true; // any active account can see this
    } else if (accountStatus === AccountStatusEnum.Inactive && petOwner) {
      return true; // any inactive pet owner can see this
    } else if (
      accountStatus === AccountStatusEnum.Inactive &&
      petBusiness &&
      petBusiness.petBusinessApplication
    ) {
      return true; // any inactive pet business with a pre-existing application can see this
    } else {
      return false;
    }
  };

  return (
    <>
      <Head>
        <title>My Account - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt="50px" mb="xl">
        <Group position="left">
          <PageTitle title="My account" />
          <AccountStatusBadge accountStatus={accountStatus} size="lg" />
        </Group>
        <Text size="sm" color="dimmed">
          Member since {dateCreated}
        </Text>
        <Accordion
          variant="separated"
          mt="xl"
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
                <AccountInfoForm
                  petOwner={petOwner}
                  refetch={refetchPetOwner}
                />
              ) : (
                <AccountInfoForm
                  petBusiness={petBusiness}
                  refetch={refetchPetBusiness}
                />
              )}
            </Accordion.Panel>
          </Accordion.Item>

          {petBusiness?.petBusinessApplication?.petBusinessApplicationId &&
            petBusiness.accountStatus !== AccountStatusEnum.Pending && (
              <Accordion.Item value="addresses">
                <Accordion.Control>
                  <Group>
                    <IconAddressBook color={theme.colors.indigo[5]} />
                    <Text size="lg">Addresses</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel p="md">
                  <AddressInfoForm
                    petBusiness={petBusiness}
                    refetch={refetchPetBusiness}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            )}

          <Accordion.Item value="password">
            <Accordion.Control>
              <Group>
                <IconKey color={theme.colors.indigo[5]} />
                <Text size="lg">Change password</Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel p="md">
              <ChangePasswordForm
                queryClient={queryClient}
                email={petOwner ? petOwner.email : petBusiness.email}
              />
            </Accordion.Panel>
          </Accordion.Item>

          {checkDisplayDeactivateReactivate() && (
            <Accordion.Item value="deactivate-reactivate">
              <Accordion.Control>
                <Group>
                  <IconAlertOctagon color={theme.colors.indigo[5]} />
                  <Text size="lg">{action} account</Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel p="md">
                <Text color="dimmed" mb="lg">
                  {action === "Deactivate"
                    ? `If you deactivate your account, your profile and content
                will be hidden from other public users of
                PetHub. If you change your mind, you may reactivate your account from this page.`
                    : `If you reactivate your account, your profile and content
                  will be visible to other public users of
                  PetHub.`}
                </Text>

                <DeactivateReactivateAccountModal
                  userId={petOwner ? petOwner.userId : petBusiness.userId}
                  action={action}
                  refetch={petOwner ? refetchPetOwner : refetchPetBusiness}
                />
              </Accordion.Panel>
            </Accordion.Item>
          )}
        </Accordion>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return null;

  const userId = session.user["userId"];
  const accountType = session.user["accountType"];

  return { props: { userId, accountType } };
}
