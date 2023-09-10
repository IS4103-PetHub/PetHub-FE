import {
  Modal,
  Button,
  Center,
  Badge,
  Group,
  Text,
  Loader,
  Notification,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import React from "react";
import { useEffect, useState } from "react";
import { useGetAllPetOwners } from "@/hooks/pet-owner";
import { AccountStatusEnum } from "@/types/constants";
import { PetOwner } from "@/types/types";
import UserDetails from "./UserDetails";

/* 
  THIS IMPLEMENTATION USES MANTINE DATATABLE, AND HAS SORT AND PAGINATION. May move these into backend rendering in the future.
*/

const PAGE_SIZE = 15;

export default function PetOwnerTable() {
  const { data: petOwners, isLoading, isError } = useGetAllPetOwners();

  //console.log("Data", petOwners);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "userId",
    direction: "asc",
  });
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<PetOwner[]>();
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

  //useEffect w no dependencies to render the table
  useEffect(() => {
    if (petOwners) {
      setRecords(petOwners);
    }
  }, [petOwners]);

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
  }, [page, sortStatus]);

  if (isLoading) {
    return (
      <>
        <Group position="center">
          <Loader size="xl" style={{ marginTop: "2rem" }} />
        </Group>
      </>
    );
  }

  if (isError) {
    return (
      <Notification title="Error" color="red" style={{ marginTop: "2rem" }}>
        There was an error loading the list of Pet Owners. Please try again
        later.
      </Notification>
    );
  }

  return (
    <>
      <h2>Pet Owners</h2>
      <DataTable
        withBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        verticalAlignment="center"
        // provide data
        records={records}
        // define columns
        columns={[
          {
            accessor: "userId",
            title: "#",
            textAlignment: "right",
            width: 150,
            sortable: true,
          },
          {
            accessor: "firstName",
            title: "First Name",
            sortable: true,
          },
          {
            accessor: "lastName",
            title: "Last Name",
            sortable: true,
          },
          {
            accessor: "accountStatus",
            title: "Status",
            width: 150,
            sortable: true,
            // this column has custom cell data rendering
            render: ({ accountStatus }) => (
              <Badge
                color={
                  accountStatus === AccountStatusEnum.Active ? "green" : "red"
                }
              >
                {accountStatus}
              </Badge>
            ),
          },
          {
            // New column for the "view more details" button. Using an appended userId to avoid double child problem
            accessor: "${record.userId}-button",
            title: "", // No title
            width: 150,
            render: (record) => (
              <Center style={{ height: "100%" }}>
                <Button size="sm" onClick={() => handleOpenModal(record)}>
                  <Group position="center" spacing="xs">
                    <IconSearch size="0.8rem" />
                    <Text>View</Text>
                  </Group>
                </Button>
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
