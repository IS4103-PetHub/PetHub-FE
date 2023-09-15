import { Container, Group } from "@mantine/core";
import { IconPaw, IconBuildingStore, IconUserCog } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { PageTitle } from "web-ui";

export default function PetBusinessApplications() {
  const router = useRouter();
  return (
    <Container fluid>
      <Group position="apart" mb="xl">
        <PageTitle title="Pet Business Applications" />
      </Group>
      Content 2
    </Container>
  );
}
