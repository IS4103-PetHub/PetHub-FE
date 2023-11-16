import { Box, Grid, MultiSelect, Radio, Text, Transition } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import dayjs from "dayjs";
import { sortBy } from "lodash";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  OrderItemStatusEnum,
  TABLE_PAGE_SIZE,
  formatISODateOnly,
  formatISODateTimeShort,
  formatISOTimeOnly,
  formatLetterCaseToEnumString,
  formatStringToLetterCase,
  getMinTableHeight,
} from "shared-utils";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import { useGetBookingsByPetBusiness } from "@/hooks/booking";
import { useGetServiceListingByPetBusinessId } from "@/hooks/service-listing";
import { Booking } from "@/types/types";

interface CreateSupportBookingItemTableProps {
  form: UseFormReturnType<any>;
  userId: number;
}

export default function CreateSupportBookingItemTable({
  form,
  userId,
}: CreateSupportBookingItemTableProps) {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  );
  const { data: bookings = [], isLoading } = useGetBookingsByPetBusiness(
    userId,
    {
      endTime: endDate.toISOString(),
      startTime: startDate.toISOString(),
    },
  );
  const { data: serviceListings = [] } =
    useGetServiceListingByPetBusinessId(userId);
  const serviceListingsOptions = serviceListings.map((listing) => ({
    value: listing.title,
    label: listing.title,
  }));
  const [serviceListingFilter, setServiceListingFilter] = useState<string[]>(
    [],
  );
  const [searchString, setSearchString] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  /*
   * Component State
   */
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<Booking[]>(bookings);
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "orderItemId",
    direction: "asc",
  });
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [searchResults, setSearchResults] = useState<Booking[]>([]);

  const orderItemStatusValues = Object.values(OrderItemStatusEnum)
    .slice(1)
    .map((status) => ({
      value: status,
      label: formatStringToLetterCase(status.toString()),
    }));

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    let filteredBookings = searchResults;
    if (serviceListingFilter.length > 0) {
      filteredBookings = filteredBookings.filter(
        (booking) =>
          booking.serviceListing.title &&
          serviceListingFilter.includes(booking.serviceListing.title),
      );
    }

    if (statusFilter.length > 0) {
      filteredBookings = filteredBookings.filter(
        (booking) =>
          booking.OrderItem.status &&
          statusFilter.includes(booking.OrderItem.status),
      );
    }

    const sortedBookings = sortBy(filteredBookings, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedBookings.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedBookings.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [
    page,
    sortStatus,
    bookings,
    searchResults,
    statusFilter,
    serviceListingFilter,
  ]);

  useEffect(() => {
    handleSearch(searchString);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (bookings.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [bookings]);

  const handleSearch = (searchStr: string) => {
    setSearchString(searchStr);
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(bookings);
      setPage(1);
      return;
    }

    // Search by title, category, tag
    setIsSearching(true);
    const results = searchOrdersForPB(bookings, searchStr);
    setSearchResults(results);
    setPage(1);
  };

  function searchOrdersForPB(bookings: Booking[], searchStr: string) {
    return bookings.filter((booking: Booking) => {
      return (
        booking.OrderItem.itemName
          .toLowerCase()
          .includes(searchStr.toLowerCase()) ||
        booking.bookingId.toString().includes(searchStr.toLowerCase())
      );
    });
  }

  const cols: any = [
    {
      accessor: "bookingId",
      title: "ID",
      sortable: true,
      width: "5vw",
    },
    {
      accessor: "OrderItem.itemName",
      title: "Name",
      sortable: true,
      render: (record) => <Text fw={500}>{record.OrderItem.itemName}</Text>,
      width: "20vw",
    },
    {
      accessor: "appointmentDate",
      title: "Appointment Date",
      render: (record) => {
        return record.dateCreated ? formatISODateOnly(record.startTime) : "-";
      },
      sortable: true,
    },
    {
      accessor: "startTime",
      title: "Start Time",
      render: (record) => {
        return record.startTime ? formatISOTimeOnly(record.startTime) : "-";
      },
      sortable: true,
    },
    {
      accessor: "endTime",
      title: "End Time",
      render: (record) => {
        return record.endTime ? formatISOTimeOnly(record.endTime) : "-";
      },
      sortable: true,
    },
    {
      accessor: "action",
      title: "Select",
      textAlignment: "left",
      width: "6vw",
      render: (record) => (
        <Radio
          name="bookingSelection"
          value={record.bookingId}
          checked={form.values.bookingId === record.bookingId}
          onChange={() => handleRowClick(record)}
        />
      ),
    },
  ];

  const handleRowClick = (record) => {
    form.setValues({
      ...form.values,
      bookingId: record.bookingId,
    });
  };

  const renderContent = () => {
    if (bookings.length === 0) {
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
              <SadDimmedMessage title="No Bookings" subtitle="" />
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
              idAccessor="bookingId"
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
        Select Booking
      </Text>
      <Grid>
        <Grid.Col span={6}>
          <MultiSelect
            size="md"
            label="Service Listing"
            placeholder="Select service listing"
            data={serviceListingsOptions}
            onChange={setServiceListingFilter}
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
            text="Search by Booking ID and name"
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
            onChange={setStatusFilter}
          />
        </Grid.Col>
      </Grid>
      {renderContent()}
    </Box>
  );
}
