import {
  BackgroundImage,
  Container,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { PageTitle } from "web-ui";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";

export default function PetLostAndFound() {
  const theme = useMantineTheme();
  return (
    <Container fluid p={50} h="100%" w="100%" bg={theme.colors.dark[6]}>
      <Group position="apart">
        <PageTitle title="Pet Lost & Found Board" color="white" />
        <LargeCreateButton
          text="New post"
          variant="white"
          className="gradient-hover"
        />
      </Group>
    </Container>
  );
}
