import { Badge, Card, Text } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import React from "react";
import {
  PetBusinessTypeEnum,
  addCommasToNumberString,
  formatNumber2Decimals,
} from "shared-utils";
import { RevenueDashboardPetBusiness } from "@/types/types";

interface TopPetBusinessesTableProps {
  records: RevenueDashboardPetBusiness[];
}

const TopPetBusinessesTable = ({ records }: TopPetBusinessesTableProps) => {
  const badgeColorMap = new Map([
    [PetBusinessTypeEnum.Service, "teal"],
    [PetBusinessTypeEnum.Fnb, "pink"],
    [PetBusinessTypeEnum.Healthcare, "indigo"],
  ]);
  return (
    <Card shadow="sm" radius="md" mt="md">
      <DataTable
        withBorder
        withColumnBorders
        striped
        verticalSpacing="sm"
        idAccessor="petBusinessId"
        records={records}
        columns={[
          {
            accessor: "rank",
            width: 80,
            render: (record) => records.indexOf(record) + 1,
          },
          {
            accessor: "companyName",
            title: "Company Name",
            ellipsis: true,
            width: "30vw",
            render: (record) => <Text fw={500}>{record.companyName}</Text>,
          },
          {
            accessor: "businessType",
            title: "Business Type",
            render: (record) => (
              <Badge color={badgeColorMap.get(record.businessType) ?? "blue"}>
                {record.businessType}
              </Badge>
            ),
          },
          {
            accessor: "dateJoined",
            title: "Date Joined",
            textAlignment: "right",
            width: "120px",
          },
          {
            accessor: "orderItemCount",
            title: "Number of Orders",
            textAlignment: "right",
            width: "10vw",
          },
          {
            accessor: "totalAmount",
            title: "Total Sales ($)",
            textAlignment: "right",
            width: "10vw",
            render: (record) =>
              addCommasToNumberString(
                formatNumber2Decimals(record.totalAmount),
              ),
          },
          {
            accessor: "totalCommission",
            title: "Total Commission ($)",
            textAlignment: "right",
            width: "10vw",
            render: (record) =>
              addCommasToNumberString(
                formatNumber2Decimals(record.totalCommission),
              ),
          },
        ]}
      />
    </Card>
  );
};

export default TopPetBusinessesTable;
