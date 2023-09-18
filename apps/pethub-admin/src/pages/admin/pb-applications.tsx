import { Container, Group, Tabs } from "@mantine/core";
import {
  IconMenu2,
  IconCircleX,
  IconCheck,
  IconClock,
} from "@tabler/icons-react";
import { useState } from "react";
import { PageTitle } from "web-ui";
import ApplicationsTable from "@/components/pb-applications/ApplicationsTable";
import { BusinessApplicationStatusEnum } from "@/types/constants";

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

export default function PetBusinessApplications() {
  const [activeTab, setActiveTab] = useState(BusinessApplicationStatusEnum.All);
  return (
    <Container fluid>
      <Group position="apart" mb="md">
        <PageTitle title="Pet Business Applications" />
      </Group>
      <ApplicationStatusBar setActiveTab={setActiveTab} />
      <ApplicationsTable applicationStatus={activeTab} />
    </Container>
  );
}
