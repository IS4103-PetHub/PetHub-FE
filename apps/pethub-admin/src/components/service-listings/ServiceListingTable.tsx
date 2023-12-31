import { Group, Badge } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import React from "react";
import {
  ServiceListing,
  TABLE_PAGE_SIZE,
  formatNumber2Decimals,
  getMinTableHeight,
} from "shared-utils";
import { formatStringToLetterCase } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import ViewServiceListingModal from "./ViewServiceListingModal";

interface ServiceListingTableProps {
  records: ServiceListing[];
  totalNumServiceListing: number;
  onDelete(id: number): void;
  canWrite: boolean;
  page: number;
  sortStatus: DataTableSortStatus;
  onSortStatusChange: any;
  onPageChange(p: number): void;
}

const ServiceListingTable = ({
  records,
  totalNumServiceListing,
  onDelete,
  canWrite,
  page,
  sortStatus,
  onSortStatusChange,
  onPageChange,
}: ServiceListingTableProps) => {
  const router = useRouter();
  return (
    <>
      <DataTable
        minHeight={getMinTableHeight(records)}
        columns={[
          {
            accessor: "title",
            title: "Title",
            textAlignment: "left",
            width: "20vw",
            sortable: true,
            ellipsis: true,
          },
          {
            accessor: "petBusiness.companyName",
            title: "Company Name",
            sortable: true,
            ellipsis: true,
            width: "10vw",
          },
          {
            accessor: "category",
            title: "Category",
            textAlignment: "left",
            width: "10vw",
            sortable: true,
            render: (record) => formatStringToLetterCase(record.category),
          },
          {
            accessor: "tags",
            title: "Tags",
            textAlignment: "left",
            width: "10vw",
            render: (record) =>
              record.tags
                ? record.tags.map((tag, index) => (
                    <React.Fragment key={tag.tagId}>
                      <Badge color="blue">{tag.name}</Badge>
                      {index < record.tags.length - 1 && "\u00A0"}{" "}
                      {/* Add space if not the last tag */}
                    </React.Fragment>
                  ))
                : "-",
          },
          {
            accessor: "basePrice",
            title: "Price ($)",
            textAlignment: "right",
            width: 100,
            sortable: true,
            render: (record) => {
              return `${formatNumber2Decimals(record.basePrice)}`;
            },
          },
          {
            // actions
            accessor: "actions",
            title: "Actions",
            width: 100,
            textAlignment: "right",
            render: (record) => (
              <Group position="right">
                <ViewActionButton
                  onClick={() =>
                    router.push(`${router.asPath}/${record.serviceListingId}`)
                  }
                />
                {canWrite && (
                  <DeleteActionButtonModal
                    title={`Are you sure you want to delete ${record.title}?`}
                    subtitle="Pet Owners would no longer be able to view this service listing."
                    onDelete={() => {
                      onDelete(record.serviceListingId);
                      if (records.length === 1 && page > 1) {
                        onPageChange(page - 1);
                      }
                    }}
                  />
                )}
              </Group>
            ),
          },
        ]}
        records={records}
        withBorder
        withColumnBorders
        striped
        verticalSpacing="sm"
        idAccessor="serviceListingId"
        highlightOnHover
        onRowClick={(record) =>
          router.push(`/admin/service-listings/${record.serviceListingId}`)
        } //sorting
        sortStatus={sortStatus}
        onSortStatusChange={onSortStatusChange}
        //pagination
        totalRecords={totalNumServiceListing}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
      />
    </>
  );
};

export default ServiceListingTable;
