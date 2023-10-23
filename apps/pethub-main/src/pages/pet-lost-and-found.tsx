import {
  Box,
  Chip,
  Container,
  Group,
  MantineProvider,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import localFont from "next/font/local";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { EMPTY_STATE_DELAY_MS, formatStringToLetterCase } from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SortBySelect from "web-ui/shared/SortBySelect";
import LostAndFoundMasonryGrid from "@/components/pet-lost-and-found/LostAndFoundMasonryGrid";
import LostAndFoundPostModal from "@/components/pet-lost-and-found/LostAndFoundPostModal";
import { useGetPetLostAndFoundPostsByRequestTypeAndUserId } from "@/hooks/pet-lost-and-found";
import {
  PetRequestTypeEnum,
  petLostAndFoundSortOptions,
} from "@/types/constants";
import { PetLostAndFound } from "@/types/types";
import { sortRecords } from "@/util";

interface PetLostAndFoundProps {
  userId: number;
}

const inter = localFont({
  src: "../../public/Inter-VariableFont.ttf",
  variable: "--font-inter",
});

const MY_POSTS_VALUE = "MY_POSTS";

export default function PetLostAndFound({ userId }: PetLostAndFoundProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [sortStatus, setSortStatus] = useState<string>("newest");
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();

  // get selected category from router query
  const activeType = router.query?.requestType as string;

  const {
    data: posts = [],
    isLoading,
    refetch,
  } = useGetPetLostAndFoundPostsByRequestTypeAndUserId(activeType, userId);
  const [records, setRecords] = useState<PetLostAndFound[]>(posts);

  useEffect(() => {
    // handle sort
    const newRecords = sortRecords(
      petLostAndFoundSortOptions,
      posts,
      sortStatus,
    );
    setRecords(newRecords);
  }, [posts, sortStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (posts.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

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

  function handleChangeSelectedType(value: string) {
    router.push({
      query: { requestType: value },
    });
  }

  function renderContent() {
    if (posts.length === 0) {
      if (isLoading) {
        return <CenterLoader mt={0} />;
      }
      // no records fetched
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <div style={styles}>
              <div style={{ opacity: 0.7 }}>
                <SadDimmedMessage
                  title="No posts found"
                  subtitle="There are no pet lost and found posts at the moment. Please check back later!"
                />
              </div>
            </div>
          )}
        </Transition>
      );
    }
    return (
      <Box mt="lg">
        <LostAndFoundMasonryGrid
          posts={records}
          sessionUserId={userId}
          refetch={refetch}
        />
      </Box>
    );
  }

  return (
    <Container fluid h="100%" w="100%" bg={theme.colors.dark[6]}>
      <Container fluid pt={50} pb={50} w="90%">
        <Group position="apart">
          <PageTitle title="Pet Lost & Found Board" color="white" />
          {userId && (
            <>
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
                refetch={refetch}
              />
            </>
          )}
        </Group>

        <Group position="apart" mt="xl">
          <Chip.Group
            multiple={false}
            value={activeType}
            onChange={(value) => handleChangeSelectedType(value)}
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
                  style={{
                    opacity:
                      router.query?.requestType === requestType ? 1 : 0.8,
                  }}
                >
                  {formatStringToLetterCase(requestType)}
                </Chip>
              ))}
              {userId && (
                <Chip
                  value={MY_POSTS_VALUE}
                  variant="filled"
                  size="lg"
                  style={{ opacity: activeType === MY_POSTS_VALUE ? 1 : 0.8 }}
                >
                  My posts
                </Chip>
              )}
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
        {renderContent()}
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
