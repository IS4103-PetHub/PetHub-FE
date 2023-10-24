import {
  Container,
  Grid,
  Group,
  MultiSelect,
  Select,
  Transition,
} from "@mantine/core";
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
  formatLetterCaseToEnumString,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import OrdersManagementTable from "web-ui/shared//order-management/ordersManagementTable";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import api from "@/api/axiosConfig";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import { useGetAllOrderItem } from "@/hooks/order";
import { useGetAllPetBusinesses } from "@/hooks/pet-business";
import { PermissionsCodeEnum } from "@/types/constants";
import { Permission } from "@/types/types";

interface OrdersProps {
  permissions: Permission[];
}

export default function Orders({ permissions }: OrdersProps) {
  const router = useRouter();

  //permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(
    PermissionsCodeEnum.WriteOrderItems,
  );
  const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadOrderItems);

  const allStatusString =
    "PENDING_BOOKING,PENDING_FULFILLMENT,FULFILLED,PAID_OUT,REFUNDED,EXPIRED";
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  );
  const [statusFilter, setStatusFilter] = useState<string>(allStatusString);
  const [petBusinessFilter, setPetBusinessFilter] = useState<number>(undefined);

  /*
   * Fetch data
   */
  const orderItemStatusValues = Object.values(OrderItemStatusEnum)
    .slice(1)
    .map((status) => formatStringToLetterCase(status.toString()));

  const {
    data: orderItems = [],
    refetch: refetchOrderItems,
    isLoading,
  } = useGetAllOrderItem(
    petBusinessFilter,
    startDate.toISOString(),
    endDate.toISOString(),
    statusFilter,
  );

  const { data: petBusiness = [] } = useGetAllPetBusinesses();

  const petBusinessOptions = petBusiness.map((petBusiness) => ({
    value: petBusiness.userId.toString(),
    label: petBusiness.companyName,
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
  const [searchString, setSearchString] = useState<string>("");

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
    handleSearch(searchString);
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
    setSearchString(searchStr);
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

  if (!canRead) {
    return <NoPermissionsMessage />;
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
              isAdmin={true}
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Orders - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart">
          <PageTitle title="Orders Management" />
        </Group>
        <Grid>
          <Grid.Col span={6}>
            <Select
              size="md"
              label="Pet Business"
              placeholder="Select pet business"
              data={petBusinessOptions}
              clearable
              onChange={(selectedPetBusiness) => {
                if (selectedPetBusiness === null) {
                  setPetBusinessFilter(undefined);
                } else {
                  setPetBusinessFilter(Number(selectedPetBusiness));
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
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <MultiSelect
              mt={-4.5}
              size="md"
              label="Status"
              placeholder="Select status"
              data={orderItemStatusValues}
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
  return { props: { permissions } };
}
