import { Modal, Center, Box, Container } from "@mantine/core";
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
import { PetOwner } from "@/types/types";
import { ViewButton } from "../common/ViewButton";
import { errorAlert } from "../util/TableHelper";
import UserDetails from "./UserDetails";

const PAGE_SIZE = 15;

export default function PetOwnerTable() {
  const { data: petOwners = [], isLoading, isError } = useGetAllPetOwners();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "userId",
    direction: "asc",
  });
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<PetOwner[]>(petOwners);
  const [isSearching, setIsSearching] = useToggle();
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

  // Compute pagination slice indices based on the current page
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE;

  // Recompute records whenever the current page or sort status changes
  useEffect(() => {
    // Sort the petOwners based on the current sort status
    const sortedPetOwners = sortBy(petOwners, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedPetOwners.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedPetOwners.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus, petOwners]);

  if (isError) {
    return errorAlert("Pet Owners");
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
    const results = petOwners.filter(
      (petOwner: PetOwner) =>
        petOwner.firstName.toLowerCase().includes(searchStr.toLowerCase()) ||
        petOwner.lastName.toLowerCase().includes(searchStr.toLowerCase()) ||
        petOwner.email.toLowerCase().includes(searchStr.toLowerCase()) ||
        (petOwner.userId &&
          searchStr.includes(petOwner.userId.toString()) &&
          searchStr.length <= petOwner.userId.toString().length),
    );
    setRecords(results);
    setPage(1);
  };

  const renderContent = () => {
    if (petOwners.length === 0) {
      if (isLoading) {
        // still fetching
        <CenterLoader />;
      }
      // no user groups fetched
      return <SadDimmedMessage title="No pet owners found" subtitle="" />;
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
            highlightOnHover
            verticalAlignment="center"
            minHeight={150}
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
                accessor: "${record.userId}-button",
                title: "Actions",
                width: 150,
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
            totalRecords={petOwners ? petOwners.length : 0}
            recordsPerPage={PAGE_SIZE}
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
      <Container fluid>
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
      </Container>
    </>
  );
}
