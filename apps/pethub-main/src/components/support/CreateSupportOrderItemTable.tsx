import {
  Badge,
  Box,
  Grid,
  MultiSelect,
  Radio,
  Text,
  Transition,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import dayjs from "dayjs";
import { sortBy } from "lodash";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  OrderItem,
  OrderItemStatusEnum,
  TABLE_PAGE_SIZE,
  formatLetterCaseToEnumString,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getMinTableHeight,
} from "shared-utils";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import OrdersManagementTable from "web-ui/shared/order-management/OrdersManagementTable";
import { useGetOrderItemsByPBId } from "@/hooks/order";
import { useGetServiceListingByPetBusinessId } from "@/hooks/service-listing";

interface CreateSupportOrderItemTableProps {
  userId: number;
  form: UseFormReturnType<any>;
}

export default function CreateSupportOrderItemTable({
  userId,
  form,
}: CreateSupportOrderItemTableProps) {
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
  const [searchString, setSearchString] = useState<string>("");
  /*
   * Fetch data
   */
  const orderItemStatusValues = Object.values(OrderItemStatusEnum)
    .slice(1)
    .map((status) => formatStringToLetterCase(status.toString()));
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

  const orderStatusColorMap = new Map([
    ["PENDING_BOOKING", "indigo"],
    ["PENDING_FULFILLMENT", "violet"],
    ["FULFILLED", "green"],
    ["PAID_OUT", "green"],
    ["REFUNDED", "orange"],
    ["EXPIRED", "red"],
  ]);

  const cols: any = [
    {
      accessor: "orderItemId",
      title: "ID",
      sortable: true,
      width: "5vw",
    },
    {
      accessor: "itemName",
      title: "Name",
      sortable: true,
      render: (record) => <Text fw={500}>{record.itemName}</Text>,
      width: "20vw",
    },
    {
      accessor: "itemPrice",
      title: "Price ($)",
      textAlignment: "right",
      render: (record) => {
        return `${formatNumber2Decimals(record.itemPrice)}`;
      },
      sortable: true,
    },
    {
      accessor: "invoice.createdAt",
      title: "Date Created",
      render: (record) => {
        return record.invoice
          ? dayjs(record.invoice.createdAt).format("DD-MM-YYYY")
          : "-";
      },
      sortable: true,
    },
    // status
    {
      accessor: "status",
      title: "Status",
      render: (record) => {
        return (
          <Badge color={orderStatusColorMap.get(record.status)}>
            {formatStringToLetterCase(record.status)}
          </Badge>
        );
      },
    },
    {
      accessor: "action",
      title: "Select",
      textAlignment: "left",
      width: "6vw",
      render: (record) => (
        <Radio
          name="orderItemSelection"
          value={record.orderItemId}
          checked={form.values.orderItemId === record.orderItemId}
          onChange={() => handleRowClick(record)}
        />
      ),
    },
  ];

  const handleRowClick = (record) => {
    // Assuming serviceListingId is a string, adjust accordingly if it's a number, etc.
    form.setValues({
      ...form.values,
      orderItemId: record.orderItemId,
    });
  };

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
            <DataTable
              minHeight={getMinTableHeight(records)}
              records={records}
              columns={cols}
              withBorder
              withColumnBorders
              striped
              verticalSpacing="sm"
              idAccessor="refundRequestId"
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              totalRecords={searchResults.length}
              recordsPerPage={TABLE_PAGE_SIZE}
              page={page}
              onPageChange={(p) => setPage(p)}
              highlightOnHover
            />
          </>
        )}
      </>
    );
  };
  return (
    <Box mb="xl">
      <Text weight={500} mb={20}>
        Select Order Item
      </Text>
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
    </Box>
  );
}
