import { Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import {
  getErrorMessageProps,
  TABLE_PAGE_SIZE,
  getMinTableHeight,
} from "shared-utils";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import SearchBar from "web-ui/shared/SearchBar";
import { useUpdateCommissionRule } from "@/hooks/commission-rule";
import { useGetAllPetBusinesses } from "@/hooks/pet-business";
import { CommissionRule, PetBusiness } from "@/types/types";
import { searchPetBusinesses } from "@/util";

interface CommissionGroupAddPBModalProps {
  refetch(): void;
  commissionRule: CommissionRule;
}

const CommissionGroupAddPBModal = ({
  refetch,
  commissionRule,
}: CommissionGroupAddPBModalProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: petBusinesses = [] } = useGetAllPetBusinesses();
  const [isSearching, setIsSearching] = useToggle();
  const [selectedRecords, setSelectedRecords] = useState<PetBusiness[]>([]);
  const [records, setRecords] = useState<PetBusiness[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    setRecords(petBusinesses?.slice(from, to) ?? []);
  }, [page, petBusinesses]);

  const queryClient = useQueryClient();
  const updateCommissionRuleMutation = useUpdateCommissionRule(queryClient);
  const handleAddUsers = async () => {
    const petBusinessIds = selectedRecords.map((record) => record.userId);
    petBusinessIds.push(...getCurrentCommissionPBIds());
    const payload = {
      commissionRuleId: commissionRule?.commissionRuleId,
      petBusinessIds,
    };
    try {
      await updateCommissionRuleMutation.mutateAsync(payload);
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

  /*
   *   Helper Functions
   */
  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setRecords(petBusinesses);
      setPage(1);
      return;
    }
    // search by id or first name or last name or email
    setIsSearching(true);
    const results = searchPetBusinesses(petBusinesses, searchStr);
    setRecords(results);
    setPage(1);
  };

  function getCurrentCommissionPBIds() {
    if (commissionRule && commissionRule.petBusinesses) {
      return commissionRule.petBusinesses.map(
        (petBusiness) => petBusiness.userId,
      );
    }
    return [];
  }

  const handleCloseModal = () => {
    close();
    setIsSearching(false);
    setRecords(petBusinesses);
    setSelectedRecords([]);
    setPage(1);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={
          <Text size="xl" weight={600}>
            Add Pet Businesses
          </Text>
        }
        size="80%"
      >
        <SearchBar
          text="Search by user ID, name, uen and email"
          onSearch={handleSearch}
        />
        <DataTable
          columns={[
            {
              accessor: "userId",
              title: "User ID",
              textAlignment: "right",
              width: "5vw",
            },
            {
              accessor: "companyName",
              title: "Name",
              textAlignment: "left",
              width: "15vw",
            },
            {
              accessor: "uen",
              title: "UEN",
              textAlignment: "left",
              width: "15vw",
            },
            {
              accessor: "email",
              title: "Email",
              textAlignment: "left",
              width: "15vw",
            },
          ]}
          minHeight={getMinTableHeight(records)}
          records={records}
          withBorder
          withColumnBorders
          striped
          verticalSpacing="sm"
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          isRecordSelectable={(record) =>
            !getCurrentCommissionPBIds().includes(record.userId)
          }
          //pagination
          totalRecords={isSearching ? records.length : petBusinesses?.length}
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
      <LargeCreateButton
        text="Add Pet Business"
        size="sm"
        mb="lg"
        onClick={open}
      />
    </>
  );
};

export default CommissionGroupAddPBModal;
