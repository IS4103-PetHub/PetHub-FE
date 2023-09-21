import { Container, Group, Tabs } from "@mantine/core";
import {
  IconMenu2,
  IconCircleX,
  IconCheck,
  IconClock,
} from "@tabler/icons-react";
import axios from "axios";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { PageTitle } from "web-ui";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import ApplicationsTable from "@/components/pb-applications/ApplicationsTable";
import {
  BusinessApplicationStatusEnum,
  PermissionsCodeEnum,
} from "@/types/constants";
import { Permission } from "@/types/types";

interface ApplicationStatusBarProps {
  setActiveTab: (value: BusinessApplicationStatusEnum) => void;
}

function ApplicationStatusBar({ setActiveTab }: ApplicationStatusBarProps) {
  return (
    <Tabs
      defaultValue={BusinessApplicationStatusEnum.All}
      onTabChange={setActiveTab}
    >
      <Tabs.List>
        <Tabs.Tab
          value={BusinessApplicationStatusEnum.All}
          icon={<IconMenu2 size="1rem" color="gray" />}
        >
          All
        </Tabs.Tab>
        <Tabs.Tab
          value={BusinessApplicationStatusEnum.Pending}
          icon={<IconClock size="1rem" color="gray" />}
        >
          Pending
        </Tabs.Tab>
        <Tabs.Tab
          value={BusinessApplicationStatusEnum.Rejected}
          icon={<IconCircleX size="1rem" color="gray" />}
        >
          Rejected
        </Tabs.Tab>
        <Tabs.Tab
          value={BusinessApplicationStatusEnum.Approved}
          icon={<IconCheck size="1rem" color="gray" />}
        >
          Approved
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}

interface PetBusinessApplicationsProps {
  permissions: Permission[];
}

export default function PetBusinessApplications({
  permissions,
}: PetBusinessApplicationsProps) {
  const [activeTab, setActiveTab] = useState(BusinessApplicationStatusEnum.All);

  //permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(
    PermissionsCodeEnum.WritePBApplications,
  );
  const canRead = permissionCodes.includes(
    PermissionsCodeEnum.ReadPBApplications,
  );

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  return (
    <>
      <Head>
        <title>Pet Business Applications - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart" mb="md">
          <PageTitle title="Pet Business Applications" />
        </Group>
        <ApplicationStatusBar setActiveTab={setActiveTab} />
        <ApplicationsTable applicationStatus={activeTab} />
      </Container>
    </>
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
  return { props: { permissions } };
}
