import { Group, Badge } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import React, { useState } from "react";
import { TABLE_PAGE_SIZE, getMinTableHeight } from "shared-utils";
import { formatStringToLetterCase } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { Address, ServiceListing, Tag } from "@/types/types";
import ServiceListingModal from "./ViewServiceListingModal";
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
            width: "25vw",
            sortable: true,
            ellipsis: true,
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
            accessor: "dateCreated",
            title: "Date Created",
            sortable: true,
            ellipsis: true,
            width: 100,
            render: ({ dateCreated }) => {
              return new Date(dateCreated).toLocaleDateString();
            },
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
                <ViewServiceListingModal serviceListing={record} />
                {canWrite ? (
                  <DeleteActionButtonModal
                    title={`Are you sure you want to delete ${record.title}?`}
                    subtitle="Pet Owners would no longer be able to view this service listing."
                    onDelete={() => {
                      onDelete(record.serviceListingId);
                      // Check if there is only 1 record on this page and we're not on the first page.
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
