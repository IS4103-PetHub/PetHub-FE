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
import React, { useEffect, useState } from "react";
import { useGetAllInternalUsers } from "@/hooks/internal-user";
import { AccountStatusEnum } from "@/types/constants";
import { InternalUser } from "@/types/types";
import UserDetails from "./UserDetails";

/* 
  THIS IMPLEMENTATION USES MANTINE DATATABLE, AND HAS SORT AND PAGINATION. May move these into backend rendering in the future.
*/

const PAGE_SIZE = 15;

export default function InternalUserTable() {
  const { data: internalUsers, isLoading, isError } = useGetAllInternalUsers();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "userId",
    direction: "asc",
  });
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<InternalUser[]>();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<InternalUser | null>(
    null,
  );

  const handleOpenModal = (record: InternalUser) => {
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
    if (internalUsers) {
      setRecords(internalUsers);
    }
  }, [internalUsers]);

  // Recompute records whenever the current page or sort status changes
  useEffect(() => {
    // Sort internalUsers based on the current sort status

    const sortedInternalUsers = sortBy(
      internalUsers,
      sortStatus.columnAccessor,
    );
    if (sortStatus.direction === "desc") {
      sortedInternalUsers.reverse();
    }

    // Slice the sorted array to get the records for the current page
    const newRecords = sortedInternalUsers.slice(from, to);

    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus]);

  if (isLoading) {
    return (
      <>
        <div className="center-vertically">
          <Group position="center">
            <Loader size="xl" style={{ marginTop: "2rem" }} />
          </Group>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <Notification title="Error" color="red" style={{ marginTop: "2rem" }}>
        There was an error loading the list of Internal Users. Please try again
        later.
      </Notification>
    );
  }

  return (
    <>
      <h2>Internal Users</h2>
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
            ellipsis: true,
          },
          {
            accessor: "lastName",
            title: "Last Name",
            sortable: true,
            ellipsis: true,
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
            title: "Actions",
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
        totalRecords={internalUsers ? internalUsers.length : 0}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => setPage(p)}
        idAccessor="userId"
      />
      <Modal
        opened={isModalOpen}
        onClose={handleCloseModal}
        title="Internal User Details"
        size="lg"
        padding="md"
      >
        <UserDetails user={selectedRecord} />
      </Modal>
    </>
  );
}
