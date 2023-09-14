import {
  Accordion,
  Container,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import {
  IconClipboardText,
  IconLockOpen,
  IconUsersGroup,
} from "@tabler/icons-react";
import React from "react";
import { PageTitle } from "web-ui";
import UserGroupInfoForm from "@/components/rbac/UserGroupInfoForm";
import { useGetUserGroupById } from "@/hooks/rbac";

interface UserGroupDetailsProps {
  groupId: number;
}

export default function UserGroupDetails({ groupId }: UserGroupDetailsProps) {
  const theme = useMantineTheme();

  const { data: userGroup } = useGetUserGroupById(groupId);
  console.log(userGroup);

  const defaultValues = ["groupInfo", "groupPermissions"];
  return (
    <Container fluid>
      <PageTitle title="User Group Details" />
      <Accordion multiple defaultValue={defaultValues}>
        <Accordion.Item value="groupInfo">
          <Accordion.Control>
            <Group>
              <IconClipboardText color={theme.colors.indigo[5]} />
              <Text weight={600} size="xl">
                Information
              </Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <UserGroupInfoForm userGroup={userGroup} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="groupPermissions">
          <Accordion.Control>
            <Group>
              <IconLockOpen color={theme.colors.indigo[5]} />
              <Text weight={600} size="xl">
                Permissions ({userGroup?.userGroupPermissions?.length})
              </Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            Configure components appearance and behavior with vast amount of
            settings or overwrite any part of component styles
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="groupMemberships">
          <Accordion.Control>
            <Group>
              <IconUsersGroup color={theme.colors.indigo[5]} />
              <Text weight={600} size="xl">
                Memberships ({userGroup?.userGroupMemberships?.length})
              </Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            With new :focus-visible pseudo-class focus ring appears only when
            user navigates with keyboard
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  const groupId = context.params.id;
  return { props: { groupId } };
}
