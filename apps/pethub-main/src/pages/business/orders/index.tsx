import { Container, Grid, Group, MultiSelect, Transition } from "@mantine/core";
import { DateInput, DatePicker } from "@mantine/dates";
import { useToggle } from "@mantine/hooks";
import dayjs from "dayjs";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  AccountTypeEnum,
  EMPTY_STATE_DELAY_MS,
  OrderItem,
  OrderItemStatusEnum,
  ServiceCategoryEnum,
  TABLE_PAGE_SIZE,
  formatEnumValueToLowerCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import OrdersManagementTable from "web-ui/shared//order-management/ordersManagementTable";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import PBOrdersTable from "@/components/pb-orders/PBOrdersTable";
import { useGetOrderItemsByPBId } from "@/hooks/order";
import { useGetServiceListingByPetBusinessId } from "@/hooks/service-listing";

interface OrdersProps {
  userId: number;
}

export default function Orders({ userId }: OrdersProps) {
  const router = useRouter();
  const allStatusString =
    "PENDING_BOOKING,PENDING_FULFILLMENT,FULFILLED,PAID_OUT,REFUNDED,EXPIRED";
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  );
  const [statusFilter, setStatusFilter] = useState<string>(allStatusString);
  const [serviceListingFilter, setServiceListingFilter] =
    useState<string>(undefined);
  /*
   * Fetch data
   */
  const orderItemStatusValues = Object.values(OrderItemStatusEnum)
    .slice(1)
    .map((status) => status.toString());
  // everytime there is a change in startdate, endate, status, sl call the endpoint to ge the new set of orders
  const {
    data: orderItems = [],
    refetch: refetchOrderItems,
    isLoading,
  } = useGetOrderItemsByPBId(
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

  /*
   * Component State
   */
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<OrderItem[]>(orderItems);
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "orderItemId",
    direction: "asc",
  });
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [searchResults, setSearchResults] = useState<OrderItem[]>([]);

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    const sortedOrderItems = sortBy(searchResults, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedOrderItems.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedOrderItems.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus, orderItems, searchResults]);

  useEffect(() => {
    setSearchResults(orderItems);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (orderItems.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [orderItems]);

  /*
   * Search Functions
   */
  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(orderItems);
      setPage(1);
      return;
    }

    // Search by title, category, tag
    setIsSearching(true);
    const results = searchOrdersForPB(orderItems, searchStr);
    setSearchResults(results);
    setPage(1);
  };

  function searchOrdersForPB(orderItems: OrderItem[], searchStr: string) {
    return orderItems.filter((orderItem: OrderItem) => {
      return (
        orderItem.itemName.toLowerCase().includes(searchStr.toLowerCase()) ||
        orderItem.orderItemId.toString().includes(searchStr.toLowerCase())
      );
    });
  }

  const renderContent = () => {
    if (orderItems.length === 0) {
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
              <SadDimmedMessage title="No Order Items found" subtitle="" />
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
            <OrdersManagementTable
              records={records}
              totalNumRecords={searchResults.length}
              page={page}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              onPageChange={setPage}
              router={router}
              isAdmin={false}
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Orders - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart">
          <PageTitle title="Orders Management" />
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
            />
          </Grid.Col>
          <Grid.Col span={9}>
            <SearchBar
              text="Search by Order ID and name"
              onSearch={handleSearch}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <MultiSelect
              size="md"
              label="Status"
              placeholder="Select status"
              data={orderItemStatusValues}
              onChange={(selectedStatus) => {
                if (selectedStatus.length === 0) {
                  setStatusFilter(allStatusString);
                } else {
                  // If selections are made, join them into a comma-separated string
                  setStatusFilter(selectedStatus.join(","));
                }
              }}
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
