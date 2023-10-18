import {
  BackgroundImage,
  Container,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getSession } from "next-auth/react";
import { PageTitle } from "web-ui";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import LostAndFoundPostModal from "@/components/pet-lost-and-found/LostAndFoundPostModal";

interface PetLostAndFoundProps {
  userId: number;
}

export default function PetLostAndFound({ userId }: PetLostAndFoundProps) {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container fluid p={50} h="100%" w="100%" bg={theme.colors.dark[6]}>
      <Group position="apart">
        <PageTitle title="Pet Lost & Found Board" color="white" />
        <LargeCreateButton
          text="New post"
          variant="white"
          className="gradient-hover"
          onClick={open}
        />
        <LostAndFoundPostModal
          petOwnerId={userId}
          opened={opened}
          close={close}
        />
      </Group>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };
  const userId = session.user["userId"];
  return { props: { userId } };
}
