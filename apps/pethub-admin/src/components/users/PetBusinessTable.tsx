import { Modal, Center } from "@mantine/core";
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
import { useGetAllPetBusinesses } from "@/hooks/pet-business";
import { PetBusiness } from "@/types/types";
import { ViewButton } from "../common/ViewButton";
import { errorAlert } from "../util/TableHelper";
import UserDetails from "./UserDetails";

const PAGE_SIZE = 10;

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
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<PetBusiness[]>(petBusinesses);
  const [isSearching, setIsSearching] = useToggle();
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

  // Compute pagination slice indices based on the current page
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE;

  // Recompute records whenever the current page or sort status changes
  useEffect(() => {
    // Sort petBusinesses based on the current sort status

    const sortedPetBusinesses = sortBy(
      petBusinesses,
      sortStatus.columnAccessor,
    );
    if (sortStatus.direction === "desc") {
      sortedPetBusinesses.reverse();
    }

    // Slice the sorted array to get the records for the current page
    const newRecords = sortedPetBusinesses.slice(from, to);

    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus, petBusinesses]);

  if (isError) {
    return errorAlert("Pet Businesses");
  }

  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setRecords(petBusinesses);
      setPage(1);
      return;
    }
    // search by id or company name or uen or email
    setIsSearching(true);
    const results = petBusinesses.filter(
      (petBusiness: PetBusiness) =>
        petBusiness.companyName
          .toLowerCase()
          .includes(searchStr.toLowerCase()) ||
        (petBusiness.uen &&
          searchStr.includes(petBusiness.uen.toString()) &&
          searchStr.length <= petBusiness.uen.toString().length) ||
        petBusiness.email.toLowerCase().includes(searchStr.toLowerCase()) ||
        (petBusiness.userId &&
          searchStr.includes(petBusiness.userId.toString()) &&
          searchStr.length <= petBusiness.userId.toString().length),
    );
    setRecords(results);
    setPage(1);
  };

  const renderContent = () => {
    if (petBusinesses.length === 0) {
      if (isLoading) {
        // still fetching
        <CenterLoader />;
      }
      // no user groups fetched
      return <SadDimmedMessage title="No pet businesses found" subtitle="" />;
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
            totalRecords={petBusinesses ? petBusinesses.length : 0}
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
