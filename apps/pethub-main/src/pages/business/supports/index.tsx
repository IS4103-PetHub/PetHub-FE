import {
  Container,
  Grid,
  Group,
  MultiSelect,
  Select,
  Transition,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  AccountStatusEnum,
  AccountTypeEnum,
  EMPTY_STATE_DELAY_MS,
  SupportTicket,
  SupportTicketReason,
  SupportTicketStatus,
  TABLE_PAGE_SIZE,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import api from "@/api/axiosConfig";
import CreateSupportModal from "@/components/support/CreateSupportModal";
import FAQInformation from "@/components/support/FAQInformation";
import PBSupportTable from "@/components/support/PBSupportTable";
import { useGetSupportTickets } from "@/hooks/support";
import { PetBusiness } from "@/types/types";

interface MyAccountProps {
  userId: number;
  accountType: AccountTypeEnum;
  canView: boolean;
}

export default function Supports({
  userId,
  accountType,
  canView,
}: MyAccountProps) {
  const router = useRouter();
  const {
    data: supportTickets = [],
    isLoading,
    refetch: refetchSupportTickets,
  } = useGetSupportTickets(userId);
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

  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<SupportTicket[]>(supportTickets);
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "supportTicketId",
    direction: "asc",
  });
  const [searchResults, setSearchResults] = useState<SupportTicket[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    let filteredSupport = searchResults;
    if (selectedCategory.length > 0) {
      filteredSupport = filteredSupport.filter(
        (support) =>
          support.supportCategory &&
          selectedCategory.includes(support.supportCategory),
      );
    }
    if (selectedStatus.length > 0) {
      filteredSupport = filteredSupport.filter(
        (support) => support.status && selectedStatus.includes(support.status),
      );
    }
    const sortedOrderItems = sortBy(filteredSupport, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedOrderItems.reverse();
    }

    // Slice the sorted array to get the records for the current page
    const newRecords = sortedOrderItems.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [
    page,
    sortStatus,
    supportTickets,
    searchResults,
    selectedCategory,
    selectedStatus,
  ]);

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

  const handleSearch = (searchStr: string) => {
    setSearchString(searchStr);
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(supportTickets);
      setPage(1);
      return;
    }

    // Search by title, category, tag
    setIsSearching(true);
    const results = searchSupportTicketForPB(supportTickets, searchStr);
    setSearchResults(results);
    setPage(1);
  };

  const searchSupportTicketForPB = (
    supportTickets: SupportTicket[],
    searchStr: string,
  ) => {
    return supportTickets.filter(
      (supportTicket) =>
        supportTicket.supportTicketId
          .toString()
          .includes(searchStr.toLowerCase()) ||
        supportTicket.reason.toLowerCase().includes(searchStr.toLowerCase()),
    );
  };

  const renderContent = () => {
    if (supportTickets?.length === 0) {
      if (isLoading) {
        return <CenterLoader />;
      }
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <Grid>
              <Grid.Col span={12}>
                <FAQInformation />
              </Grid.Col>
              <Grid.Col span={12}>
                <div style={styles}>
                  <SadDimmedMessage
                    title="No Support Ticket found"
                    subtitle="Click 'Create Support Ticket' to create a new Support Ticket"
                  />
                </div>
              </Grid.Col>
            </Grid>
          )}
        </Transition>
      );
    }

    return (
      <>
        <Grid>
          <Grid.Col span={6}>
            <SearchBar
              size="md"
              text="Search by id and reason"
              onSearch={handleSearch}
            />
          </Grid.Col>
          <Grid.Col span={3}>
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
          <Grid.Col span={3}>
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
        </Grid>
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <Grid>
            <Grid.Col span={9} style={{ height: "100%" }}>
              <PBSupportTable
                records={records}
                totalNumSupportTicket={searchResults.length}
                refetch={refetchSupportTickets}
                page={page}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                onPageChange={setPage}
                router={router}
              />
            </Grid.Col>
            <Grid.Col span={3} style={{ height: "100%" }}>
              <FAQInformation />
            </Grid.Col>
          </Grid>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Support Tickets - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid m="lg">
        <Group position="apart">
          <PageTitle title="Support Tickets" />
          <CreateSupportModal userId={userId} refetch={refetchSupportTickets} />
        </Group>
        {renderContent()}
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const accountType = session.user["accountType"];
  const accountStatus = session.user["accountStatus"];
  const petBusiness = (await (
    await api.get(`/users/pet-businesses/${userId}`)
  ).data) as PetBusiness;

  const canView =
    accountStatus !== AccountStatusEnum.Pending &&
    petBusiness.petBusinessApplication;

  return { props: { userId, accountType, canView } };
}
