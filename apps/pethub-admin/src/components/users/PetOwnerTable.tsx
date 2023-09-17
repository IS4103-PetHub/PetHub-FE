import { Modal, Center, Transition } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import AccountStatusBadge from "web-ui/shared/AccountStatusBadge";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import { useGetAllPetOwners } from "@/hooks/pet-owner";
import { EMPTY_STATE_DELAY_MS, TABLE_PAGE_SIZE } from "@/types/constants";
import { PetOwner } from "@/types/types";
import { getMinTableHeight, searchPetOwners } from "@/util";
import { ErrorAlert } from "../common/ErrorAlert";
import { ViewButton } from "../common/ViewButton";
import UserDetails from "./UserDetails";

export default function PetOwnerTable() {
  const { data: petOwners = [], isLoading, isError } = useGetAllPetOwners();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "userId",
    direction: "asc",
  });
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<PetOwner[]>(petOwners);
  const [isSearching, setIsSearching] = useToggle();
  const [hasNoFetchedRecords, sethasNoFetchedRecords] = useToggle();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PetOwner | null>(null);

  const handleOpenModal = (record: PetOwner) => {
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
    if (petOwners.length > 0 && hasNoFetchedRecords) {
      sethasNoFetchedRecords(false);
    }
    // Sort the petOwners based on the current sort status
    const sortedPetOwners = sortBy(petOwners, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedPetOwners.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedPetOwners.slice(from, to);
    setRecords(newRecords);
  }, [page, sortStatus, petOwners, hasNoFetchedRecords]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after 0.8s
      if (petOwners.length === 0) {
        sethasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (isError) {
    return ErrorAlert("Pet Owners");
  }

  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setRecords(petOwners);
      setPage(1);
      return;
    }
    // search by id or first name or last name or email
    setIsSearching(true);
    const results = searchPetOwners(petOwners, searchStr);
    setRecords(results);
    setPage(1);
  };

  const renderContent = () => {
    if (petOwners.length === 0) {
      if (isLoading) {
        // still fetching
        <CenterLoader />;
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
                title="No pet owners found"
                subtitle=""
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
          text="Search by pet owner ID, first name, last name, email"
          onSearch={handleSearch}
        />
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <DataTable
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
                accessor: "firstName",
                title: "First Name",
                sortable: true,
                ellipsis: true,
              },
              {
                accessor: "lastName",
                title: "Last Name",
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
                    <ViewButton onClick={() => handleOpenModal(record)} />
                  </Center>
                ),
              },
            ]}
            //sorting
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            //pagination
            totalRecords={isSearching ? records.length : petOwners?.length}
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
      <PageTitle title="Pet Owners" />
      {renderContent()}

      <Modal
        opened={isModalOpen}
        onClose={handleCloseModal}
        title="Pet Owner Details"
        size="lg"
        padding="md"
      >
        <UserDetails user={selectedRecord} />
      </Modal>
    </>
  );
}
