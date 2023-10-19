import {
  BackgroundImage,
  Chip,
  Container,
  Group,
  MantineProvider,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import localFont from "next/font/local";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { formatStringToLetterCase } from "shared-utils";
import { PageTitle } from "web-ui";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import SortBySelect from "web-ui/shared/SortBySelect";
import LostAndFoundPostModal from "@/components/pet-lost-and-found/LostAndFoundPostModal";
import {
  PetRequestTypeEnum,
  petLostAndFoundSortOptions,
  serviceListingSortOptions,
} from "@/types/constants";

interface PetLostAndFoundProps {
  userId: number;
}

const inter = localFont({
  src: "../../public/Inter-VariableFont.ttf",
  variable: "--font-inter",
});

export default function PetLostAndFound({ userId }: PetLostAndFoundProps) {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [activeType, setActiveType] = useState<PetRequestTypeEnum | string>("");
  const [sortStatus, setSortStatus] = useState<string>("");

  const handleClickNewPost = async () => {
    const session = await getSession();
    if (!session) {
      notifications.show({
        title: "Login Required",
        message: "Please log in to create a new post!",
        color: "red",
      });
      return;
    }
    open();
  };

  return (
    <Container fluid h="100%" w="100%" bg={theme.colors.dark[6]}>
      <Container fluid pt={50} pb={50} w="90%">
        <Group position="apart">
          <PageTitle title="Pet Lost & Found Board" color="white" />
          <LargeCreateButton
            mt={-10}
            text="New post"
            // variant="white"
            className="gradient-hover"
            onClick={handleClickNewPost}
          />
          <LostAndFoundPostModal
            petOwnerId={userId}
            opened={opened}
            close={close}
          />
        </Group>

        <Group position="apart" mt="xl">
          <Chip.Group
            multiple={false}
            value={activeType}
            onChange={setActiveType}
          >
            <Group position="left" w="75%">
              <Chip
                value=""
                variant="filled"
                size="lg"
                style={{ opacity: !activeType ? 1 : 0.8 }}
              >
                All
              </Chip>

              {Object.values(PetRequestTypeEnum).map((requestType) => (
                <Chip
                  variant="filled"
                  size="lg"
                  value={requestType}
                  key={requestType}
                  style={{ opacity: activeType === requestType ? 1 : 0.8 }}
                >
                  {formatStringToLetterCase(requestType)}
                </Chip>
              ))}
            </Group>
          </Chip.Group>
          <MantineProvider
            theme={{
              colorScheme: "dark",
              fontFamily: inter.style.fontFamily,
            }}
          >
            <SortBySelect
              data={petLostAndFoundSortOptions}
              value={sortStatus}
              onChange={setSortStatus}
            />
          </MantineProvider>
        </Group>
      </Container>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };
  const userId = session.user["userId"];
  return { props: { userId } };
}
