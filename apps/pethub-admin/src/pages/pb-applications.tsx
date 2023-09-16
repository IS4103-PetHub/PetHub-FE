import { Container, Group, Tabs } from "@mantine/core";
import {
  IconBallTennis,
  IconMenu2,
  IconCircleX,
  IconCheck,
} from "@tabler/icons-react";
import { useState } from "react";
import { PageTitle } from "web-ui";
import ApplicationsTable from "@/components/pbapplications/ApplicationsTable";
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
          icon={<IconBallTennis size="0.8rem" />}
        >
          All
        </Tabs.Tab>
        <Tabs.Tab
          value={BusinessApplicationStatusEnum.Pending}
          icon={<IconMenu2 size="0.8rem" />}
        >
          Pending
        </Tabs.Tab>
        <Tabs.Tab
          value={BusinessApplicationStatusEnum.Rejected}
          icon={<IconCircleX size="0.8rem" />}
        >
          Rejected
        </Tabs.Tab>
        <Tabs.Tab
          value={BusinessApplicationStatusEnum.Approved}
          icon={<IconCheck size="0.8rem" />}
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
