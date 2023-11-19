import { Container, Grid, Group, MultiSelect, Transition } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  Priority,
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
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import AdminSupportTable from "@/components/support/AdminSupportTable";
import { useGetSupportTickets } from "@/hooks/support";
import { PermissionsCodeEnum } from "@/types/constants";
import { Permission } from "@/types/types";

interface SupportProps {
  userId: number;
  permissions: Permission[];
}

export default function Support({ userId, permissions }: SupportProps) {
  const router = useRouter();
  // permissions
  // const permissionCodes = permissions.map((permission) => permission.code);
  // const canWrite = permissionCodes.includes(
  //     PermissionsCodeEnum.WriteSupport,
  // );
  // const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadSupport);
  const canWrite = true;
  const canRead = true;

  // fetch data
  const {
    data: supportTickets = [],
    refetch: refetchSupportTickets,
    isLoading,
  } = useGetSupportTickets();

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

  const supportPriorityValues = Object.values(Priority).map((value) => ({
    label: formatStringToLetterCase(value),
    value,
  }));

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
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);

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
      setIsSearching(true);
    }
    if (selectedStatus.length > 0) {
      filteredSupport = filteredSupport.filter(
        (support) => support.status && selectedStatus.includes(support.status),
      );
      setIsSearching(true);
    }
    if (selectedPriority.length > 0) {
      filteredSupport = filteredSupport.filter(
        (support) =>
          support.priority && selectedPriority.includes(support.priority),
      );
      setIsSearching(true);
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
    selectedPriority,
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
    const results = searchSupportTicket(supportTickets, searchStr);
    setSearchResults(results);
    setPage(1);
  };

  const searchSupportTicket = (
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
            <div style={styles}>
              <SadDimmedMessage
                title="No Support Ticket found"
                subtitle="Wait for Pet Owners and Pet Businesses to create a new Support Ticket"
              />
            </div>
          )}
        </Transition>
      );
    }

    if (!canRead) {
      return <NoPermissionsMessage />;
    }

    return (
      <>
        <Grid>
          <Grid.Col span={4}>
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
          <Grid.Col span={4}>
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
          <Grid.Col span={4}>
            <MultiSelect
              mt={-4.5}
              size="md"
              label="Priority"
              placeholder="Select Priority"
              data={supportPriorityValues}
              value={selectedPriority}
              onChange={setSelectedPriority}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <SearchBar
              size="md"
              text="Search by id and reason"
              onSearch={handleSearch}
            />
          </Grid.Col>
        </Grid>
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <>
            <AdminSupportTable
              records={records}
              totalNumSupportTicket={searchResults.length}
              refetch={refetchSupportTickets}
              page={page}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              onPageChange={setPage}
              router={router}
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Support Tickets - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart" mb="md">
          <PageTitle title="Support Management" />
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
  const permissions = await (
    await api.get(`/rbac/users/${userId}/permissions`)
  ).data;

  return { props: { userId, permissions } };
}
