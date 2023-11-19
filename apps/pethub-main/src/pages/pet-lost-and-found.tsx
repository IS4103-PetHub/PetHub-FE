import {
  Box,
  Chip,
  Container,
  Grid,
  Group,
  MantineProvider,
  Select,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import localFont from "next/font/local";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { EMPTY_STATE_DELAY_MS, formatStringToLetterCase } from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import SortBySelect from "web-ui/shared/SortBySelect";
import LostAndFoundMasonryGrid from "@/components/pet-lost-and-found/LostAndFoundMasonryGrid";
import LostAndFoundPostModal from "@/components/pet-lost-and-found/LostAndFoundPostModal";
import { useGetPetLostAndFoundPostsByRequestTypeAndUserId } from "@/hooks/pet-lost-and-found";
import {
  PetRequestTypeEnum,
  petLostAndFoundSortOptions,
} from "@/types/constants";
import { PetLostAndFound } from "@/types/types";
import { searchPetLostAndFoundPosts, sortRecords } from "@/util";

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
  const [filterStatus, setFilterStatus] = useState<string>("unresolved");
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [isSearching, setIsSearching] = useToggle();

  // get selected category from router query
  const activeType = router.query?.requestType as string;

  const {
    data: posts = [],
    isLoading,
    refetch,
  } = useGetPetLostAndFoundPostsByRequestTypeAndUserId(activeType, userId);
  const [records, setRecords] = useState<PetLostAndFound[]>(posts);

  const filterByStatus = () => {
    switch (filterStatus) {
      case "resolved":
        return posts.filter((post) => post.isResolved);
      case "unresolved":
        return posts.filter((post) => !post.isResolved);
      default:
        return posts;
    }
  };

  useEffect(() => {
    // handle filter by status if any
    const filtered = filterByStatus();
    // handle sort
    const newRecords = sortRecords(
      petLostAndFoundSortOptions,
      filtered,
      sortStatus,
    );
    setRecords(newRecords);
  }, [posts, sortStatus, filterStatus]);

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

  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setRecords(filterByStatus());
      return;
    }
    setIsSearching(true);
    const filtered = filterByStatus();
    const results = searchPetLostAndFoundPosts(filtered, searchStr);
    setRecords(results);
  };

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

    if (records.length === 0 && (filterStatus || isSearching)) {
      return (
        <div style={{ opacity: 0.7 }}>
          <SadDimmedMessage
            title="No matching posts"
            subtitle="Please remove any existing search filters and try again!"
          />
        </div>
      );
    }

    return (
      <Box mt="xs">
        <LostAndFoundMasonryGrid
          posts={records}
          sessionUserId={userId}
          refetch={refetch}
        />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Pet Lost and Found - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
              <Group position="left" w="50%">
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
              <Grid>
                <Grid.Col span={6}>
                  <Select
                    dropdownPosition="bottom"
                    size="md"
                    w="100%"
                    mt={-25}
                    label="Filter by status"
                    placeholder="Select status"
                    data={[
                      {
                        value: "unresolved",
                        label: "Unresolved",
                      },
                      {
                        value: "resolved",
                        label: "Resolved",
                      },
                    ]}
                    clearable
                    value={filterStatus}
                    onChange={setFilterStatus}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <SortBySelect
                    w="100%"
                    data={petLostAndFoundSortOptions}
                    value={sortStatus}
                    onChange={setSortStatus}
                  />
                </Grid.Col>
              </Grid>
              <SearchBar
                mt={10}
                size="md"
                w="100%"
                text="Search by title, description, author name"
                onSearch={(searchStr) => handleSearch(searchStr)}
              />
            </MantineProvider>
          </Group>
          {renderContent()}
        </Container>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };
  const userId = session.user["userId"];
  return { props: { userId } };
}
