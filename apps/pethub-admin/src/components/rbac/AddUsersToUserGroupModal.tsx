import { Button, Modal, Group, Text } from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import { getErrorMessageProps, getMinTableHeight } from "shared-utils";
import { TABLE_PAGE_SIZE } from "shared-utils";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import SearchBar from "web-ui/shared/SearchBar";
import { useGetAllInternalUsers } from "@/hooks/internal-user";
import { useAddMultipleUsersToUserGroup } from "@/hooks/rbac";
import { InternalUser, UserGroup } from "@/types/types";
import { searchInternalUsers } from "@/util";
import { ErrorAlert } from "../common/ErrorAlert";

interface AddUsersToUserGroupModalProps {
  userGroup?: UserGroup;
  refetch(): void;
}

const AddUsersToUserGroupModal = ({
  userGroup,
  refetch,
}: AddUsersToUserGroupModalProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const { data: internalUsers = [], isError } = useGetAllInternalUsers();

  const [isSearching, setIsSearching] = useToggle();
  const [selectedRecords, setSelectedRecords] = useState<InternalUser[]>([]);
  const [records, setRecords] = useState<InternalUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchResults, setSearchResults] = useState<InternalUser[]>([]);

  const handleCloseModal = () => {
    // reset the table
    close();
    setIsSearching(false);
    setRecords(internalUsers);
    setSelectedRecords([]);
    setPage(1);
  };

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    setRecords(searchResults?.slice(from, to) ?? []);
  }, [page, internalUsers, searchResults]);

  useEffect(() => {
    setSearchResults(internalUsers);
  }, [internalUsers]);

  function getCurrentMembershipUserIds() {
    if (userGroup && userGroup.userGroupMemberships) {
      return userGroup.userGroupMemberships.map(
        (userGroupMembership) => userGroupMembership.userId,
      );
    }
    return [];
  }

  const addMultipleUsersToUserGroupMutation = useAddMultipleUsersToUserGroup();
  const handleAddUsers = async () => {
    const userIds = selectedRecords.map((record) => record.userId);
    const payload = { groupId: userGroup?.groupId, userIds };
    try {
      await addMultipleUsersToUserGroupMutation.mutateAsync(payload);
      notifications.show({
        title: "Group Membership Updated",
        color: "green",
        icon: <IconCheck />,
        message: `${selectedRecords.length} user(s) have been assigned to this group successfully!`,
      });
      refetch();
      handleCloseModal();
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Assigning User(s)", error),
      });
    }
  };

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

  if (isError) {
    return ErrorAlert("Internal Users");
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={
          <Text size="xl" weight={600}>
            Add members
          </Text>
        }
        size="80%"
        centered
      >
        <SearchBar
          text="Search by internal user ID, first name, last name, email"
          onSearch={handleSearch}
        />
        <DataTable
          minHeight={getMinTableHeight(records)}
          columns={[
            {
              accessor: "userId",
              title: "User ID",
              textAlignment: "right",
              width: 80,
            },
            {
              accessor: "firstName",
              width: "15vw",
              ellipsis: true,
            },
            {
              accessor: "lastName",
              width: "15vw",
              ellipsis: true,
            },
            {
              accessor: "email",
              width: "25vw",
              ellipsis: true,
            },
          ]}
          records={records}
          withBorder
          withColumnBorders
          striped
          verticalSpacing="sm"
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          isRecordSelectable={(record) =>
            !getCurrentMembershipUserIds().includes(record.userId)
          }
          //pagination
          totalRecords={searchResults.length}
          recordsPerPage={TABLE_PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
          idAccessor="userId"
          noRecordsText={
            isSearching ? "No matching records found" : "No records"
          }
        />
        <Group mt="lg" position="right">
          <Button onClick={close} color="gray" type="reset">
            Cancel
          </Button>
          <Button
            onClick={handleAddUsers}
            disabled={selectedRecords.length === 0}
          >
            Add Selected Users
          </Button>
        </Group>
      </Modal>
      <LargeCreateButton text="Add members" size="sm" mb="lg" onClick={open} />
    </>
  );
};

export default AddUsersToUserGroupModal;
