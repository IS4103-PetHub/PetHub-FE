import { Group, Tabs, Box } from "@mantine/core";
import { Text } from "@mantine/core";
import { IconSum } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import React from "react";
import { useEffect, useState } from "react";
import { usePetOwnerRetrieveAll } from "@/hooks/pet-owner";
// import { useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 15;

export default function PetOwnerTable() {
  const petOwners = [
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "INACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "1",
      firstName: "John",
      lastName: "Doe",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
    {
      adminId: "2",
      firstName: "Jack",
      lastName: "Sparrow",
      AccountTypeEnum: "PET_OWNER",
      AccountStatusEnum: "ACTIVE",
    },
  ];

  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(petOwners.slice(0, PAGE_SIZE));

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(petOwners.slice(from, to));
  }, [page]);

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
            accessor: "adminId",
            // this column has a custom title
            title: "#",
            // right-align column
            textAlignment: "right",
            width: 150,
            // footer: (
            //   <Group spacing="xs">
            //     <IconSum size="1.25em" />
            //     <Text mb={-2}>{records.length} Pet Owners</Text>
            //   </Group>
            // ),
          },
          { accessor: "firstName", title: "First Name" },
          {
            accessor: "lastName",
            title: "Last Name",
          },
          {
            accessor: "AccountStatusEnum",
            title: "Status",
            // this column has custom cell data rendering
            render: ({ AccountStatusEnum }) => (
              <Text
                weight={700}
                color={AccountStatusEnum === "ACTIVE" ? "green" : "red"}
              >
                {AccountStatusEnum.charAt(0).toUpperCase()}
                {AccountStatusEnum.slice(1).toLowerCase()}
              </Text>
            ),
          },
        ]}
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
