import { Modal, Center } from "@mantine/core";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import AccountStatusBadge from "web-ui/shared/AccountStatusBadge";
import { useGetAllPetBusinesses } from "@/hooks/pet-business";
import { PetBusiness } from "@/types/types";
import { ViewButton } from "../common/ViewButton";
import { errorAlert, loader } from "../util/TableHelper";
import UserDetails from "./UserDetails";

/* 
  THIS IMPLEMENTATION USES MANTINE DATATABLE, AND HAS SORT AND PAGINATION. May move these into backend rendering in the future.
*/

const PAGE_SIZE = 15;

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

  if (isLoading) {
    return loader();
  }

  if (isError) {
    return errorAlert("Pet Businesses");
  }

  return (
    <>
      <PageTitle title="Pet Businesses" />
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
