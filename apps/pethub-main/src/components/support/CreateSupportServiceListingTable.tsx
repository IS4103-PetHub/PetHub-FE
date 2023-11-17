import {
  Badge,
  Box,
  Checkbox,
  Group,
  Radio,
  Text,
  Transition,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { sortBy } from "lodash";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  ServiceListing,
  TABLE_PAGE_SIZE,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getMinTableHeight,
  isValidServiceListing,
} from "shared-utils";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import { useGetServiceListingByPetBusinessId } from "@/hooks/service-listing";

interface CreateSupportServiceListingTableProps {
  form: UseFormReturnType<any>;
  userId: number;
}

export default function CreateSupportServiceListingTable({
  form,
  userId,
}: CreateSupportServiceListingTableProps) {
  const { data: serviceListings = [], isLoading } =
    useGetServiceListingByPetBusinessId(userId);
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<ServiceListing[]>(serviceListings);
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "serviceListingId",
    direction: "asc",
  });
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [searchResults, setSearchResults] = useState<ServiceListing[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  const handleSearch = (searchStr: string) => {
    setSearchString(searchStr);
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(serviceListings);
      setPage(1);
      return;
    }

    // Search by title, category, tag
    setIsSearching(true);
    const results = searchServiceListing(serviceListings, searchStr);
    setSearchResults(results);
    setPage(1);
  };

  function searchServiceListing(
    serviceListings: ServiceListing[],
    searchStr: string,
  ) {
    return serviceListings.filter((serviceListing: ServiceListing) => {
      return (
        serviceListing.serviceListingId
          .toString()
          .includes(searchStr.toLowerCase()) ||
        serviceListing.title.toLowerCase().includes(searchStr.toLowerCase())
      );
    });
  }

  const cols: any = [
    {
      accessor: "serviceListingId",
      title: "Id",
      textAlignment: "left",
      width: "4vw",
      sortable: true,
      ellipsis: true,
    },
    {
      accessor: "title",
      title: "Title",
      textAlignment: "left",
      width: "25vw",
      sortable: true,
      ellipsis: true,
      render: (record) => <Text fw={500}>{record.title}</Text>,
    },
    {
      accessor: "category",
      title: "Category",
      textAlignment: "left",
      width: "10vw",
      sortable: true,
      render: (record) => formatStringToLetterCase(record.category),
    },
    {
      accessor: "basePrice",
      title: "Price ($)",
      textAlignment: "right",
      width: "7vw",
      sortable: true,
      render: (record) => {
        return formatNumber2Decimals(record.basePrice);
      },
    },
    {
      accessor: "action",
      title: "Select",
      textAlignment: "left",
      width: "5vw",
      render: (record) => (
        <Radio
          name="serviceListingSelection"
          value={record.serviceListingId}
          checked={form.values.serviceListingId === record.serviceListingId}
          onChange={() => handleRowClick(record)}
        />
      ),
    },
  ];

  const handleRowClick = (record) => {
    // Assuming serviceListingId is a string, adjust accordingly if it's a number, etc.
    form.setValues({
      ...form.values,
      serviceListingId: record.serviceListingId,
    });
  };

  const renderContent = () => {
    if (serviceListings.length === 0) {
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
              <SadDimmedMessage title="No Service Listing Found" subtitle="" />
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
              idAccessor="serviceListingId"
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

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    const sortedServiceListing = sortBy(
      searchResults,
      sortStatus.columnAccessor,
    );
    if (sortStatus.direction === "desc") {
      sortedServiceListing.reverse();
    }
    const newRecords = sortedServiceListing.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus, serviceListings, searchResults]);

  useEffect(() => {
    handleSearch(searchString);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (serviceListings.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [serviceListings]);

  return (
    <Box mb="xl">
      <Text>Select service listing</Text>
      <SearchBar text="Search by ID, title" onSearch={handleSearch} />
      {renderContent()}
    </Box>
  );
}
