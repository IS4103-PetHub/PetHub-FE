import {
  Container,
  Accordion,
  Text,
  Group,
  useMantineTheme,
  Grid,
} from "@mantine/core";
import { IconUser, IconKey, IconLockOpen } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getSession } from "next-auth/react";
import React from "react";
import { formatISODateString } from "shared-utils";
import { PageTitle } from "web-ui";
import AccountStatusBadge from "web-ui/shared/AccountStatusBadge";
import ChangePasswordForm from "web-ui/shared/ChangePasswordForm";
import AccountInfoForm from "@/components/account/AccountInfoForm";
import PermissionsCheckboxCard from "@/components/rbac/PermissionsCheckboxCard";
import { useGetInternalUserById } from "@/hooks/internal-user";
import { AccountStatusEnum, AccountTypeEnum } from "@/types/constants";
import { Permission } from "@/types/types";

interface MyAccountProps {
  userId: number;
  permissions: Permission[];
}

export default function MyAccount({ userId, permissions }: MyAccountProps) {
  const theme = useMantineTheme();
  const queryClient = useQueryClient();

  const defaultValues = ["account", "permissions"];

  const { data: internalUser, refetch } = useGetInternalUserById(userId);

  const userPermissions = (
    <Grid gutter="xl">
      {permissions.map((permission) => (
        <Grid.Col span={6} key={permission.permissionId}>
          <PermissionsCheckboxCard permission={permission} isEditing={false} />
        </Grid.Col>
      ))}
    </Grid>
  );

  return (
    <Container mt="50px" mb="xl">
      <Group position="left">
        <PageTitle title="My account" />
        <AccountStatusBadge
          accountStatus={internalUser?.accountStatus}
          size="lg"
        />
      </Group>
      <Text size="sm" color="dimmed">
        Member since {formatISODateString(internalUser?.dateCreated)}
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
            <AccountInfoForm internalUser={internalUser} refetch={refetch} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="permissions">
          <Accordion.Control>
            <Group>
              <IconLockOpen color={theme.colors.indigo[5]} />
              <Text size="lg">Account permissions ({permissions.length})</Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel p="md">
            {permissions.length > 0 ? (
              userPermissions
            ) : (
              <Text color="dimmed" mb="md">
                No permissions assigned
              </Text>
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
              queryClient={queryClient}
              email={internalUser?.email}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const permissions = await (
    await axios.get(
      `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/rbac/users/${userId}/permissions`,
    )
  ).data;
  return { props: { userId, permissions } };
}
