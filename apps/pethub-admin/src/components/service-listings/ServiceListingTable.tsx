import { Group, Badge } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import React from "react";
import {
  ServiceListing,
  TABLE_PAGE_SIZE,
  getMinTableHeight,
} from "shared-utils";
import { formatStringToLetterCase } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ViewServiceListingModal from "./ViewServiceListingModal";

interface ServiceListingTableProps {
  records: ServiceListing[];
  totalNumServiceListing: number;
  onDelete(id: number): void;
  canWrite: boolean;
  isSearching: boolean;
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
  isSearching,
  page,
  sortStatus,
  onSortStatusChange,
  onPageChange,
}: ServiceListingTableProps) => {
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
              return `${record.basePrice.toFixed(2)}`;
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
                <ViewServiceListingModal
                  canWrite={canWrite}
                  onDelete={() => {
                    onDelete(record.serviceListingId);
                    if (records.length === 1 && page > 1) {
                      onPageChange(page - 1);
                    }
                  }}
                  serviceListing={record}
                />
                {canWrite ? (
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
                ) : null}
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
        //sorting
        sortStatus={sortStatus}
        onSortStatusChange={onSortStatusChange}
        //pagination
        totalRecords={isSearching ? records.length : totalNumServiceListing}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
      />
    </>
  );
};

export default ServiceListingTable;
