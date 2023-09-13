import { Modal, Center, Group, Button } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import AccountStatusBadge from "web-ui/shared/AccountStatusBadge";
import { useGetAllInternalUsers } from "@/hooks/internal-user";
import { InternalUser } from "@/types/types";
import { ViewButton } from "../common/ViewButton";
import { errorAlert, loader } from "../util/TableHelper";
import { CreateInternalUserForm } from "./CreateInternalUserForm";
import UserDetails from "./UserDetails";

/* 
  THIS IMPLEMENTATION USES MANTINE DATATABLE, AND HAS SORT AND PAGINATION. May move these into backend rendering in the future.
*/

const PAGE_SIZE = 15;

export default function InternalUserTable() {
  const {
    data: internalUsers = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllInternalUsers();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "userId",
    direction: "asc",
  });
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<InternalUser[]>(internalUsers);
  const [isViewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<InternalUser | null>(
    null,
  );
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleViewDetailsOpenModal = (record: InternalUser) => {
    setSelectedRecord(record);
    setViewDetailsModalOpen(true);
  };

  const handleViewDetailsCloseModal = () => {
    setSelectedRecord(null);
    setViewDetailsModalOpen(false);
  };

  const handleCreateInternalUserOpenModal = () => {
    setCreateModalOpen(true);
  };

  // Compute pagination slice indices based on the current page
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE;

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
  }, [page, sortStatus, internalUsers]);

  if (isLoading) {
    return loader();
  }

  if (isError) {
    return errorAlert("Internal Users");
  }

  return (
    <>
      <Group mb="xl" position="apart">
        {/* wanted to use the CreateButton but thought that UserPlus is a better icon for this case */}
        <PageTitle title="Internal Users" />
        <Button
          size="md"
          leftIcon={<IconUserPlus />}
          onClick={() => handleCreateInternalUserOpenModal()}
        >
          Create Internal User
        </Button>
      </Group>

      <DataTable
        withBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        verticalAlignment="center"
        minHeight={100}
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
                <ViewButton
                  onClick={() => handleViewDetailsOpenModal(record)}
                />
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
        opened={isViewDetailsModalOpen}
        onClose={handleViewDetailsCloseModal}
        title="Internal User Details"
        size="lg"
        padding="md"
      >
        <UserDetails
          user={selectedRecord}
          onUserDeleted={(success) => {
            if (success) {
              handleViewDetailsCloseModal();
            }
            refetch();
          }}
        />
      </Modal>
      <Modal
        opened={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Internal User"
        size="lg"
        padding="md"
      >
        <CreateInternalUserForm
          onUserCreated={(success) => {
            if (success) {
              setCreateModalOpen(false);
            }
            refetch();
          }}
        />
      </Modal>
    </>
  );
}
