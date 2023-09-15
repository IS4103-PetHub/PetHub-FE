import { Modal, Center, Group, Button, Container } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconUserPlus } from "@tabler/icons-react";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import AccountStatusBadge from "web-ui/shared/AccountStatusBadge";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import { useGetAllInternalUsers } from "@/hooks/internal-user";
import { InternalUser } from "@/types/types";
import { ViewButton } from "../common/ViewButton";
import { errorAlert } from "../util/TableHelper";
import { CreateInternalUserForm } from "./CreateInternalUserForm";
import UserDetails from "./UserDetails";

const PAGE_SIZE = 15;

interface InternalUserTableProps {
  sessionUserId: number;
}

export default function InternalUserTable({
  sessionUserId,
}: InternalUserTableProps) {
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
  const [isSearching, setIsSearching] = useToggle();
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

  if (isError) {
    return errorAlert("Internal Users");
  }
  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setRecords(internalUsers);
      setPage(1);
      return;
    }
    // search by id or first name or last name or email
    setIsSearching(true);
    const results = internalUsers.filter(
      (internalUser: InternalUser) =>
        internalUser.firstName
          .toLowerCase()
          .includes(searchStr.toLowerCase()) ||
        internalUser.lastName.toLowerCase().includes(searchStr.toLowerCase()) ||
        internalUser.email.toLowerCase().includes(searchStr.toLowerCase()) ||
        (internalUser.userId &&
          searchStr.includes(internalUser.userId.toString()) &&
          searchStr.length <= internalUser.userId.toString().length),
    );
    setRecords(results);
    setPage(1);
  };

  const renderContent = () => {
    if (internalUsers.length === 0) {
      if (isLoading) {
        // still fetching
        <CenterLoader />;
      }
      // no user groups fetched
      return (
        <SadDimmedMessage
          title="No Internal Users found"
          subtitle="Click 'Create Internal User' to create a new user"
        />
      );
    }
    return (
      <>
        <SearchBar
          text="Search by internal ID, first name, last name, email"
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
        )}
      </>
    );
  };

  return (
    <>
      <Container fluid>
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
        {renderContent()}
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
            onUserUpdated={(success) => {
              if (success) {
                handleViewDetailsCloseModal();
              }
              refetch();
            }}
            sessionUserId={sessionUserId}
          />
        </Modal>
        <Modal
          opened={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
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
      </Container>
    </>
  );
}
