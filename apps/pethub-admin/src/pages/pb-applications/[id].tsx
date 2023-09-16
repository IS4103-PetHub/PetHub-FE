import { Container, Group } from "@mantine/core";
import { IconPaw, IconBuildingStore, IconUserCog } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";

export default function PetBusinessApplication() {
  const router = useRouter();
  return (
    <Container fluid>
      <Group position="apart" mb="xl">
        <PageTitle title="Application Details" />
        <LargeBackButton
          text="Back to applications"
          onClick={() => router.back()}
        />
      </Group>
      Content for application with ID: {router.query.id}
    </Container>
  );
}
