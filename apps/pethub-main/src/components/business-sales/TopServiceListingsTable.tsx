import { Card, Text } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useRouter } from "next/router";
import React from "react";
import { addCommasToNumberString, formatNumber2Decimals } from "shared-utils";
import { SalesDashboardServiceListing } from "@/types/types";
import ServiceCategoryBadge from "../service-listing-discovery/ServiceCategoryBadge";

interface TopServiceListingsTableProps {
  records: SalesDashboardServiceListing[];
}
const TopServiceListingsTable = ({ records }: TopServiceListingsTableProps) => {
  const router = useRouter();
  return (
    <Card shadow="sm" radius="md" mt="md">
      <DataTable
        withBorder
        withColumnBorders
        striped
        verticalSpacing="sm"
        idAccessor="serviceListingId"
        records={records}
        highlightOnHover
        onRowClick={(record) =>
          router.push(`/business/listings/${record.serviceListingId}`)
        }
        columns={[
          {
            accessor: "rank",
            width: 80,
            render: (record) => records.indexOf(record) + 1,
          },
          {
            accessor: "title",
            ellipsis: true,
            width: "35vw",
            render: (record) => <Text fw={500}>{record.title}</Text>,
          },
          {
            accessor: "category",
            render: (record) => (
              <ServiceCategoryBadge category={record.category} />
            ),
          },
          {
            accessor: "totalOrders",
            title: "Number of Orders",
            textAlignment: "right",
            width: "10vw",
          },
          {
            accessor: "totalSales",
            title: "Total Sales ($)",
            textAlignment: "right",
            width: "10vw",
            render: (record) =>
              addCommasToNumberString(formatNumber2Decimals(record.totalSales)),
          },
        ]}
      />
    </Card>
  );
};

export default TopServiceListingsTable;
