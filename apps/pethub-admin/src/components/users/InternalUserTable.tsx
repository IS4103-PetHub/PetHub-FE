import { Modal, Center, Group, Button, Text, Transition } from "@mantine/core";
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
import { EMPTY_STATE_DELAY_MS, TABLE_PAGE_SIZE } from "@/types/constants";
import { InternalUser } from "@/types/types";
import { searchInternalUsers } from "@/util";
import { ErrorAlert } from "../common/ErrorAlert";
import { ViewButton } from "../common/ViewButton";
import { CreateInternalUserForm } from "./CreateInternalUserForm";
import UserDetails from "./UserDetails";

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
  const [hasNoFetchedRecords, sethasNoFetchedRecords] = useToggle();
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

  // Recompute records whenever the current page or sort status changes
  useEffect(() => {
    // Compute pagination slice indices based on the current page
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    if (internalUsers.length > 0 && hasNoFetchedRecords) {
      sethasNoFetchedRecords(false);
    }
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
    setRecords(newRecords);
  }, [page, sortStatus, internalUsers, hasNoFetchedRecords]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after 0.8s
      if (internalUsers.length === 0) {
        sethasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (isError) {
    return ErrorAlert("Internal Users");
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
    const results = searchInternalUsers(internalUsers, searchStr);
    setRecords(results);
    setPage(1);
  };

  const renderContent = () => {
    if (internalUsers.length === 0) {
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
                title="No Internal Users found"
                subtitle="Click 'Create Internal User' to create a new user"
              />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        <SearchBar
          text="Search by internal user ID, first name, last name, email"
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
                accessor: "actions",
                title: "Actions",
                width: 150,
                textAlignment: "right",
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
            totalRecords={isSearching ? records.length : internalUsers?.length}
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
      <Group mb="xl" position="apart">
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
        title={
          <Text size="xl" weight={600} ml="xs">
            Create Internal User
          </Text>
        }
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
