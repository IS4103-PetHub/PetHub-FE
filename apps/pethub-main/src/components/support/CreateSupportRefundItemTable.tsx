import {
  Badge,
  Box,
  Grid,
  MultiSelect,
  Radio,
  Text,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  RefundRequest,
  RefundStatusEnum,
  TABLE_PAGE_SIZE,
  formatISODateTimeShort,
  formatLetterCaseToEnumString,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getMinTableHeight,
} from "shared-utils";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import { useGetRefundRequestsByPBId } from "@/hooks/refund";
import { useGetServiceListingByPetBusinessId } from "@/hooks/service-listing";

interface CreateSupportRefundTableProps {
  form: UseFormReturnType<any>;
  userId: number;
}

export default function CreateSupportRefundItemTable({
  form,
  userId,
}: CreateSupportRefundTableProps) {
  const refundStatusColorMap = new Map([
    ["PENDING", "orange"],
    ["APPROVED", "green"],
    ["REJECTED", "red"],
  ]);

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

  const handleRowClick = (record) => {
    // Assuming serviceListingId is a string, adjust accordingly if it's a number, etc.
    form.setValues({
      ...form.values,
      refundRequestId: record.refundRequestId,
    });
  };

  const cols: any = [
    {
      accessor: "refundRequestId",
      title: "ID",
      width: 80,
    },
    {
      accessor: "orderItem.itemName",
      title: "Order Item Name",
      elipsis: true,
      sortable: true,
      render: (record) => <Text fw={500}>{record.orderItem.itemName}</Text>,
      width: "20vw",
    },
    {
      accessor: "orderItem.itemPrice",
      title: "Price ($)",
      textAlignment: "right",
      render: (record) => {
        return `${formatNumber2Decimals(record.orderItem.itemPrice)}`;
      },
      sortable: true,
    },
    {
      accessor: "createdAt",
      title: "Date Created",
      render: (record) => {
        return record.createdAt
          ? formatISODateTimeShort(record.createdAt)
          : "-";
      },
      sortable: true,
    },
    {
      accessor: "processedAt",
      title: "Date Processed",
      render: (record) => {
        return record.processedAt
          ? formatISODateTimeShort(record.processedAt)
          : "-";
      },
      sortable: true,
    },
    {
      accessor: "status",
      title: "Status",
      render: (record) => {
        return (
          <Badge color={refundStatusColorMap.get(record.status)}>
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
          name="refundItemSelection"
          value={record.refundRequestId}
          checked={form.values.refundRequestId === record.refundRequestId}
          onChange={() => handleRowClick(record)}
        />
      ),
    },
  ];

  return (
    <Box mb="xl">
      <Text weight={500} mb={20}>
        Select Refund Item
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
    </Box>
  );
}
