import { Modal, Center, Transition } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import { getMinTableHeight } from "shared-utils";
import { EMPTY_STATE_DELAY_MS, TABLE_PAGE_SIZE } from "shared-utils";
import { PageTitle } from "web-ui";
import AccountStatusBadge from "web-ui/shared/AccountStatusBadge";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import { useGetAllPetBusinesses } from "@/hooks/pet-business";
import { PetBusiness } from "@/types/types";
import { searchPetBusinesses } from "@/util";
import { ErrorAlert } from "../common/ErrorAlert";
import { ViewButtonWithEvent } from "../common/ViewButtonWithEvent";
import UserDetails from "./UserDetails";

export default function PetBusinessTable() {
  const {
    data: petBusinesses = [],
    isLoading,
    isError,
  } = useGetAllPetBusinesses();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "userId",
    direction: "asc",
  });
  const [searchResults, setSearchResults] = useState<PetBusiness[]>([]);
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<PetBusiness[]>(petBusinesses);
  const [isSearching, setIsSearching] = useToggle();
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PetBusiness | null>(
    null,
  );

  const handleOpenModal = (record: PetBusiness) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRecord(null);
    setModalOpen(false);
  };

  // Recompute records whenever the current page or sort status changes
  useEffect(() => {
    // Compute pagination slice indices based on the current page
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    const sortedPetBusinesses = sortBy(
      searchResults,
      sortStatus.columnAccessor,
    );
    if (sortStatus.direction === "desc") {
      sortedPetBusinesses.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedPetBusinesses.slice(from, to);
    setRecords(newRecords);
  }, [page, sortStatus, petBusinesses, hasNoFetchedRecords, searchResults]);

  useEffect(() => {
    setSearchResults(petBusinesses);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (petBusinesses.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [petBusinesses]);

  if (isError) {
    return ErrorAlert("Pet Businesses");
  }

  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(petBusinesses);
      setPage(1);
      return;
    }
    // search by id or company name or uen or email
    setIsSearching(true);
    const results = searchPetBusinesses(petBusinesses, searchStr);
    setSearchResults(results);
    setPage(1);
  };

  const renderContent = () => {
    if (petBusinesses.length === 0) {
      if (isLoading) {
        return <CenterLoader />;
      }
      // no records fetched
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <div style={styles}>
              <SadDimmedMessage
                title="No pet businesses found"
                disabled={!hasNoFetchedRecords}
              />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        <SearchBar
          text="Search by pet business ID, company name, uen, email"
          onSearch={handleSearch}
        />
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <DataTable
            highlightOnHover
            onRowClick={(record) => handleOpenModal(record)}
            rowStyle={{ cursor: "pointer" }}
            withBorder
            borderRadius="sm"
            withColumnBorders
            striped
            verticalAlignment="center"
            minHeight={getMinTableHeight(records)}
            // provide data
            records={records}
            // define columns
            columns={[
              {
                accessor: "userId",
                title: "#",
                textAlignment: "right",
                width: 100,
                sortable: true,
              },
              {
                accessor: "companyName",
                title: "Company Name",
                sortable: true,
                ellipsis: true,
              },
              {
                accessor: "uen",
                title: "UEN",
                sortable: true,
                ellipsis: true,
              },
              {
                accessor: "email",
                title: "Email",
                sortable: true,
                ellipsis: true,
                width: 300,
              },
              {
                accessor: "dateCreated",
                title: "Date Created",
                sortable: true,
                ellipsis: true,
                width: 150,
                render: ({ dateCreated }) => {
                  return new Date(dateCreated).toLocaleDateString();
                },
              },
              {
                accessor: "accountStatus",
                title: "Status",
                width: 150,
                sortable: true,
                // this column has custom cell data rendering
                render: ({ accountStatus }) => (
                  <AccountStatusBadge accountStatus={accountStatus} size="lg" />
                ),
              },
              {
                // New column for the "view more details" button. Using an appended userId to avoid double child problem
                accessor: "actions",
                title: "Actions",
                width: 150,
                textAlignment: "right",
                render: (record) => (
                  <Center style={{ height: "100%" }}>
                    <ViewButtonWithEvent
                      onClick={(e: any) => {
                        e.stopPropagation();
                        handleOpenModal(record);
                      }}
                    />
                  </Center>
                ),
              },
            ]}
            //sorting
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            //pagination
            totalRecords={searchResults.length}
            recordsPerPage={TABLE_PAGE_SIZE}
            page={page}
            onPageChange={(p) => setPage(p)}
            idAccessor="userId"
          />
        )}
      </>
    );
  };

  return (
    <>
      <PageTitle title="Pet Businesses" />
      {renderContent()}
      <Modal
        opened={isModalOpen}
        onClose={handleCloseModal}
        title="Pet Business Details"
        size="lg"
        padding="md"
      >
        <UserDetails user={selectedRecord} />
      </Modal>
    </>
  );
}
