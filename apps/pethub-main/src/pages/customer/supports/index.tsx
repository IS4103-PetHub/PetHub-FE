import {
  Box,
  Card,
  Container,
  Grid,
  Group,
  MultiSelect,
  Select,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  SupportTicket,
  SupportTicketReason,
  SupportTicketStatus,
  formatEnumValueToLowerCase,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import SupportTicketCard from "@/components/support/pet-owner/SupportTicketCard";
import { useGetSupportTickets } from "@/hooks/support";

interface MyAccountProps {
  userId: number;
}

export default function Supports({ userId }: MyAccountProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [searchString, setSearchString] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SupportTicket[]>([]);
  const [isSearching, setIsSearching] = useToggle();
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const {
    data: supportTickets = [],
    isLoading,
    refetch: refetchSupportTickets,
  } = useGetSupportTickets(userId);
  const [records, setRecords] = useState<SupportTicket[]>(supportTickets);
  const supportStatusValue = Object.values(SupportTicketStatus).map(
    (value) => ({
      label: formatStringToLetterCase(value),
      value,
    }),
  );
  const supportReasonValue = Object.values(SupportTicketReason).map(
    (value) => ({
      label: formatStringToLetterCase(value),
      value,
    }),
  );

  useEffect(() => {
    let filteredSupport = searchResults;
    if (selectedCategory.length > 0) {
      filteredSupport = filteredSupport.filter(
        (support) =>
          support.supportCategory &&
          selectedCategory.includes(support.supportCategory),
      );
      setIsSearching(true);
    }
    if (selectedStatus.length > 0) {
      filteredSupport = filteredSupport.filter(
        (support) => support.status && selectedStatus.includes(support.status),
      );
      setIsSearching(true);
    }
    setRecords(filteredSupport);
  }, [supportTickets, searchResults, selectedCategory, selectedStatus]);

  useEffect(() => {
    handleSearch(searchString);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (supportTickets.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [supportTickets]);

  const cardTitles = Object.values(SupportTicketReason)
    .map((reason) => ({
      formattedValue: formatStringToLetterCase(reason),
      originalValue: reason,
    }))
    .sort((a, b) => a.formattedValue.localeCompare(b.formattedValue));

  const handleSearch = (searchStr: string) => {
    setSearchString(searchStr);
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(supportTickets);
      return;
    }
    setIsSearching(true);
    const results = searchSupportTicket(supportTickets, searchStr);
    setSearchResults(results);
  };

  function searchSupportTicket(supportTickets: SupportTicket[], searchStr) {
    return supportTickets.filter((tickets) => {
      return (
        tickets.supportTicketId.toString().includes(searchStr.toLowerCase()) ||
        tickets.reason.toLowerCase().includes(searchStr.toLowerCase())
      );
    });
  }

  const supportTicketCard = records?.map((ticket) => (
    <Grid.Col span={6} key={ticket.supportTicketId}>
      <SupportTicketCard ticket={ticket} />
    </Grid.Col>
  ));

  const renderContent = () => {
    if (supportTickets.length === 0) {
      if (isLoading) {
        return <CenterLoader />;
      }
      return (
        <SadDimmedMessage
          title="No Support Ticket found"
          subtitle="New Support Tickets will appear here"
        />
      );
    }

    return (
      <>
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <Grid mb="xl">{supportTicketCard}</Grid>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>My Supports - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box bg={theme.colors.indigo[1]} h="400px" mb={"xl"}>
        <Container size="60vw" sx={{ overflow: "hidden" }}>
          <Box mb={"xl"}>
            <PageTitle title={"Welcome to PetHub Support Serivce"} mb="lg" />
            <Text size={"xl"}>
              What would you like help with today? <br /> You can quicky take
              care of most things here, or connect with us @pethub215@gmail.com
              when needed
            </Text>
          </Box>
          <Grid>
            {cardTitles.map((title, index) => (
              <Grid.Col span={3} key={index}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  onClick={() =>
                    router.push(
                      `/customer/supports/create?category=${title.originalValue}`,
                    )
                  }
                >
                  {title.formattedValue}
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>
      <Container>
        <Grid>
          <Grid.Col span={6}>
            <MultiSelect
              mt={-4.5}
              size="md"
              label="Category"
              placeholder="Select category"
              data={supportReasonValue}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <MultiSelect
              mt={-4.5}
              size="md"
              label="Status"
              placeholder="Select status"
              data={supportStatusValue}
              value={selectedStatus}
              onChange={setSelectedStatus}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <SearchBar
              text="Search by Support Ticket ID and Reason"
              onSearch={handleSearch}
            />
          </Grid.Col>
        </Grid>
        {renderContent()}
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
