import { Container, Group, Transition } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import UserGroupsTable from "@/components/rbac/UserGroupsTable";
import { useDeleteUserGroup, useGetAllUserGroups } from "@/hooks/rbac";
import { EMPTY_STATE_DELAY_MS, TABLE_PAGE_SIZE } from "@/types/constants";
import { UserGroup } from "@/types/types";

export default function RBAC() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: userGroups = [],
    isLoading,
    refetch,
    isError,
  } = useGetAllUserGroups();

  // for table
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<UserGroup[]>(userGroups);
  const [isSearching, setIsSearching] = useToggle();
  const [hasNoFetchedRecords, sethasNoFetchedRecords] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "groupId",
    direction: "asc",
  });

  // Recompute records whenever the current page or sort status changes
  const from = (page - 1) * TABLE_PAGE_SIZE;
  const to = from + TABLE_PAGE_SIZE;

  useEffect(() => {
    const sortedUserGroups = sortBy(userGroups, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedUserGroups.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedUserGroups.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus, userGroups]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after 0.8s
      if (userGroups.length === 0) {
        sethasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const deleteUserGroupMutation = useDeleteUserGroup(queryClient);
  const handleDeleteUserGroup = async (id: number) => {
    try {
      await deleteUserGroupMutation.mutateAsync(id);
      notifications.show({
        title: "User Group Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `User group ${id} deleted successfully.`,
      });
    } catch (error: any) {
      notifications.show({
        title: "Error Deleting User Group",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
  };

  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setRecords(userGroups);
      setPage(1);
      return;
    }
    // search by id or name
    setIsSearching(true);
    const results = userGroups.filter(
      (userGroup: UserGroup) =>
        userGroup.name.toLowerCase().includes(searchStr.toLowerCase()) ||
        (userGroup.groupId &&
          searchStr.includes(userGroup.groupId.toString()) &&
          searchStr.length <= userGroup.groupId.toString().length),
    );
    setRecords(results);
    setPage(1);
  };

  if (isError) {
    return ErrorAlert("User Groups");
  }

  const renderContent = () => {
    if (userGroups.length === 0) {
      if (isLoading) {
        // still fetching
        <CenterLoader />;
      }
      // no user groups fetched
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <div style={styles}>
              <SadDimmedMessage
                title="No user groups found"
                subtitle="Click 'Create User Group' to create a new group"
              />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        <SearchBar
          text="Search by user group ID, name"
          onSearch={handleSearch}
        />
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <UserGroupsTable
            userGroups={records}
            totalNumUserGroups={userGroups.length}
            onDelete={handleDeleteUserGroup}
            page={page}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <Container fluid>
      <Group position="apart" mb="xl">
        <PageTitle title="Role-based Access Control" />
        <LargeCreateButton
          text="Create User Group"
          onClick={() => router.push(`${router.asPath}/create`)}
        />
      </Group>

      {renderContent()}
    </Container>
  );
}
