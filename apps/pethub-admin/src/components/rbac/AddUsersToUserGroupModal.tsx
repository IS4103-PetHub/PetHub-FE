import { Button, Modal, Group, Text } from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import SearchBar from "web-ui/shared/SearchBar";
import { useGetAllInternalUsers } from "@/hooks/internal-user";
import { useAddMultipleUsersToUserGroup } from "@/hooks/rbac";
import { TABLE_PAGE_SIZE } from "@/types/constants";
import { InternalUser, UserGroup } from "@/types/types";
import { getMinTableHeight, searchInternalUsers } from "@/util";
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

  const handleCloseModal = () => {
    // reset the table
    close();
    setIsSearching(false);
    setRecords(internalUsers);
    setSelectedRecords([]);
    setPage(1);
  };

  const from = (page - 1) * TABLE_PAGE_SIZE;
  const to = from + TABLE_PAGE_SIZE;

  useEffect(() => {
    setRecords(internalUsers?.slice(from, to) ?? []);
  }, [page, internalUsers]);

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
        message:
          "The selected user(s) have been assigned to this group successfully!",
      });
      refetch();
      close();
      setSelectedRecords([]);
    } catch (error: any) {
      notifications.show({
        title: "Error Assigning User(s)",
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
          minHeight={getMinTableHeight(internalUsers)}
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
          totalRecords={isSearching ? records.length : internalUsers?.length}
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
