import { Container, Grid, Group, MultiSelect, Transition } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useToggle } from "@mantine/hooks";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  AccountStatusEnum,
  EMPTY_STATE_DELAY_MS,
  OrderItem,
  OrderItemStatusEnum,
  RefundRequest,
  RefundStatusEnum,
  TABLE_PAGE_SIZE,
  formatLetterCaseToEnumString,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import api from "@/api/axiosConfig";
import PBCannotAccessMessage from "@/components/common/PBCannotAccessMessage";
import RefundTable from "@/components/refund/RefundManagementTable";
import { useGetOrderItemsByPBId } from "@/hooks/order";
import { useGetRefundRequestsByPBId } from "@/hooks/refund";
import { useGetServiceListingByPetBusinessId } from "@/hooks/service-listing";
import { PetBusiness } from "@/types/types";

interface RefundsProps {
  userId: number;
  canView: boolean;
}

export default function Refunds({ userId, canView }: RefundsProps) {
  const router = useRouter();
  const allStatusString = "PENDING,APPROVED,REJECTED";
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  );
  const [statusFilter, setStatusFilter] = useState<string>(allStatusString);
  const [serviceListingFilter, setServiceListingFilter] =
    useState<string>(undefined);
  const [searchString, setSearchString] = useState<string>("");

  const refundStatusValues = Object.values(RefundStatusEnum).map((status) =>
    formatStringToLetterCase(status.toString()),
  );

  const {
    data: refundRequests = [],
    refetch: refetchRefundRequests,
    isLoading,
  } = useGetRefundRequestsByPBId(
    userId,
    startDate.toISOString(),
    endDate.toISOString(),
    statusFilter,
    serviceListingFilter,
  );
  const { data: serviceListings = [] } =
    useGetServiceListingByPetBusinessId(userId);

  const serviceListingsOptions = serviceListings.map((listing) => ({
    value: listing.serviceListingId.toString(),
    label: listing.title,
  }));

  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<RefundRequest[]>(refundRequests);
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "refundRequestId",
    direction: "asc",
  });
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [searchResults, setSearchResults] = useState<RefundRequest[]>([]);

  console.log("refund requests", refundRequests);

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    // const sortedRefundRequests = sortBy(searchResults, sortStatus.columnAccessor);
    // if (sortStatus.direction === "desc") {
    //   sortedRefundRequests.reverse();
    // }
    // Slice the sorted array to get the records for the current page
    const newRecords = searchResults.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus, refundRequests, searchResults]);

  useEffect(() => {
    handleSearch(searchString);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (refundRequests.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [refundRequests]);

  /*
   * Search Functions
   */
  const handleSearch = (searchStr: string) => {
    setSearchString(searchStr);
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(refundRequests);
      setPage(1);
      return;
    }

    // Search by title, category, tag
    setIsSearching(true);
    const results = searchRefundsForPB(refundRequests, searchStr);
    setSearchResults(results);
    setPage(1);
  };

  function searchRefundsForPB(
    refundRequests: RefundRequest[],
    searchStr: string,
  ) {
    return refundRequests.filter((refundRequests: RefundRequest) => {
      return (
        refundRequests.orderItem.itemName
          .toLowerCase()
          .includes(searchStr.toLowerCase()) ||
        refundRequests.refundRequestId
          .toString()
          .includes(searchStr.toLowerCase())
      );
    });
  }

  const renderContent = () => {
    if (refundRequests.length === 0) {
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
              <SadDimmedMessage title="No Refund Requests Found" subtitle="" />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <>
            <RefundTable
              records={records}
              totalNumRecords={searchResults.length}
              page={page}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              onPageChange={setPage}
              refetch={refetchRefundRequests}
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Refunds - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {!canView ? (
        <PBCannotAccessMessage />
      ) : (
        <Container fluid>
          <Group position="apart">
            <PageTitle title="Refund Request Management" />
          </Group>
          <Grid>
            <Grid.Col span={6}>
              <MultiSelect
                size="md"
                label="Service Listing"
                placeholder="Select service listing"
                data={serviceListingsOptions}
                onChange={(selectedServiceListing) => {
                  if (selectedServiceListing.length === 0) {
                    setServiceListingFilter(undefined);
                  } else {
                    setServiceListingFilter(selectedServiceListing.join(","));
                  }
                }}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <DateInput
                size="md"
                valueFormat="DD-MM-YYYY"
                label="Start Date"
                placeholder="Select start date"
                value={new Date(startDate)}
                onChange={(newDate) => setStartDate(newDate)}
                error={
                  startDate > endDate && "Start date cannot be after end date."
                }
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <DateInput
                size="md"
                valueFormat="DD-MM-YYYY"
                label="End Date"
                placeholder="Select end date"
                value={new Date(endDate)}
                onChange={(newDate) => setEndDate(newDate)}
                error={
                  endDate < startDate && "End date cannot be before start date."
                }
              />
            </Grid.Col>
            <Grid.Col span={9}>
              <SearchBar
                text="Search by Refund ID and name"
                onSearch={handleSearch}
                size="md"
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <MultiSelect
                mt={-4.5}
                size="md"
                label="Status"
                placeholder="Select status"
                data={refundStatusValues}
                onChange={(selectedStatus) => {
                  if (selectedStatus.length === 0) {
                    setStatusFilter(allStatusString);
                  } else {
                    // If selections are made, join them into a comma-separated string
                    const statusFilterValues = selectedStatus.map((status) =>
                      formatLetterCaseToEnumString(status),
                    );
                    setStatusFilter(statusFilterValues.join(","));
                  }
                }}
              />
            </Grid.Col>
          </Grid>
          {renderContent()}
        </Container>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const accountStatus = session.user["accountStatus"];
  const petBusiness = (await (
    await api.get(`/users/pet-businesses/${userId}`)
  ).data) as PetBusiness;

  const canView =
    accountStatus !== AccountStatusEnum.Pending &&
    petBusiness.petBusinessApplication;

  return { props: { userId, canView } };
}
