import { Group, Tabs, Box } from "@mantine/core";
import { Text } from "@mantine/core";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import React from "react";
import { useEffect, useState } from "react";
import { usePetOwnerRetrieveAll } from "@/hooks/pet-owner";
import { PetOwner } from "@/types/types";
// import { useQueryClient } from "@tanstack/react-query";

/* 
  THIS IMPLEMENTATION USES MANTINE DATATABLE, AND HAS SORT AND PAGINATION. SEARCH/FILTER IS WORK IN PROGRESS
*/

const PAGE_SIZE = 15;

export default function PetOwnerTable() {
  let petOwners = [
    {
      petOwnerId: 1,
      firstName: "John",
      lastName: "A",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 2,
      firstName: "Jack",
      lastName: "B",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "INACTIVE",
    },
    {
      petOwnerId: 3,
      firstName: "John",
      lastName: "C",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 4,
      firstName: "Jack",
      lastName: "D",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 5,
      firstName: "John",
      lastName: "E",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 6,
      firstName: "Jack",
      lastName: "F",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 7,
      firstName: "John",
      lastName: "G",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 8,
      firstName: "Jack",
      lastName: "H",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 9,
      firstName: "John",
      lastName: "I",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 10,
      firstName: "Jack",
      lastName: "J",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 11,
      firstName: "John",
      lastName: "K",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 12,
      firstName: "Jack",
      lastName: "L",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 13,
      firstName: "John",
      lastName: "M",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 14,
      firstName: "Jack",
      lastName: "N",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 15,
      firstName: "John",
      lastName: "O",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 16,
      firstName: "Jack",
      lastName: "P",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 17,
      firstName: "John",
      lastName: "Q",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 18,
      firstName: "Jack",
      lastName: "R",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 19,
      firstName: "John",
      lastName: "S",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 20,
      firstName: "Jack",
      lastName: "T",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 21,
      firstName: "John",
      lastName: "U",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 22,
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 23,
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 24,
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 25,
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 26,
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 27,
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 28,
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 29,
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 30,
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 31,
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 32,
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 33,
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
    {
      petOwnerId: 34,
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      accountStatus: "ACTIVE",
    },
  ];

  // Initialize sort status
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "petOwnerId",
    direction: "asc",
  });

  // Initialize current page
  const [page, setPage] = useState(1);

  // Initialize records state
  const [records, setRecords] = useState<PetOwner[]>([]);

  // Recompute records whenever the current page or sort status changes
  useEffect(() => {
    // Sort the petOwners based on the current sort status
    const sortedPetOwners = sortBy(petOwners, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedPetOwners.reverse();
    }

    // Compute pagination slice indices based on the current page
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;

    // Slice the sorted array to get the records for the current page
    const newRecords = sortedPetOwners.slice(from, to);

    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus]);
  // const { status, data, error, isFetching } = usePetOwnerRetrieveAll();

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
        // height={700}
        // provide data
        // records={data}
        records={records}
        // define columns
        columns={[
          {
            accessor: "petOwnerId",
            // this column has a custom title
            title: "#",
            // right-align column
            textAlignment: "right",
            width: 150,
            sortable: true,
            // footer: (
            //   <Group spacing="xs">
            //     <IconSum size="1.25em" />
            //     <Text mb={-2}>{records.length} Pet Owners</Text>
            //   </Group>
            // ),
          },
          { accessor: "firstName", title: "First Name", sortable: true },
          {
            accessor: "lastName",
            title: "Last Name",
            sortable: true,
          },
          {
            accessor: "accountStatus",
            title: "Status",
            width: 150,
            // this column has custom cell data rendering
            render: ({ accountStatus }) => (
              <Text
                weight={700}
                color={accountStatus === "ACTIVE" ? "green" : "red"}
              >
                {accountStatus.charAt(0).toUpperCase()}
                {accountStatus.slice(1).toLowerCase()}
              </Text>
            ),
          },
        ]}
        //sorting
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        //pagination
        totalRecords={petOwners.length}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => setPage(p)}
        // execute this callback when a row is clicked
        onRowClick={({ firstName, lastName, AccountTypeEnum }) =>
          alert(
            `You clicked on ${firstName} ${lastName}, a ${AccountTypeEnum} `,
          )
        }
      />
    </>
  );
}
