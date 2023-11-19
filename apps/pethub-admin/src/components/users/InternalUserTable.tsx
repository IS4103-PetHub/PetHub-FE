import { Modal, Center, Group, Button, Text, Transition } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconUserPlus } from "@tabler/icons-react";
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
import { useGetAllInternalUsers } from "@/hooks/internal-user";
import { InternalUser } from "@/types/types";
import { searchInternalUsers } from "@/util";
import { ErrorAlert } from "../common/ErrorAlert";
import { ViewButtonWithEvent } from "../common/ViewButtonWithEvent";
import { CreateInternalUserForm } from "./CreateInternalUserForm";
import UserDetails from "./UserDetails";

interface InternalUserTableProps {
  sessionUserId: number;
  disabled: boolean;
}

export default function InternalUserTable({
  sessionUserId,
  disabled,
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
  const [searchResults, setSearchResults] = useState<InternalUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<InternalUser[]>(internalUsers);
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
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
    const sortedInternalUsers = sortBy(
      searchResults,
      sortStatus.columnAccessor,
    );
    if (sortStatus.direction === "desc") {
      sortedInternalUsers.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedInternalUsers.slice(from, to);
    setRecords(newRecords);
  }, [page, sortStatus, internalUsers, hasNoFetchedRecords, searchResults]);

  useEffect(() => {
    setSearchResults(internalUsers);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (internalUsers.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [internalUsers]);

  if (isError) {
    return ErrorAlert("Internal Users");
  }

  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(internalUsers); // reset search results
      setPage(1);
      return;
    }
    // search by id or first name or last name or email
    setIsSearching(true);
    const results = searchInternalUsers(internalUsers, searchStr);
    setSearchResults(results);
    setPage(1);
  };

  const renderContent = () => {
    if (internalUsers.length === 0) {
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
            highlightOnHover
            onRowClick={(record) => handleViewDetailsOpenModal(record)}
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
                    <ViewButtonWithEvent
                      onClick={(e: any) => {
                        e.stopPropagation();
                        handleViewDetailsOpenModal(record);
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

  const handlePaginationAfterDeletion = () => {
    // Calculate the total pages after deletion
    const totalPages = Math.ceil((internalUsers.length - 1) / TABLE_PAGE_SIZE);

    // If the current page is greater than total pages, go back to the previous page
    if (page > totalPages) {
      setPage(page - 1);
    }
  };

  return (
    <>
      <Group mb="xl" position="apart">
        <PageTitle title="Internal Users" />
        {!disabled && (
          <Button
            size="md"
            leftIcon={<IconUserPlus />}
            onClick={() => handleCreateInternalUserOpenModal()}
          >
            Create Internal User
          </Button>
        )}
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
              handlePaginationAfterDeletion();
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
          disabled={disabled}
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
