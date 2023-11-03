import { Group, Badge, Text, Alert } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Address,
  CalendarGroup,
  ServiceListing,
  Tag,
  getErrorMessageProps,
  getMinTableHeight,
  isValidServiceListing,
} from "shared-utils";
import { formatStringToLetterCase } from "shared-utils";
import { TABLE_PAGE_SIZE } from "shared-utils";
import { formatNumber2Decimals } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditActionButton from "web-ui/shared/EditActionButton";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { useDeleteServiceListingById } from "@/hooks/service-listing";
import ServiceListingModal from "./ServiceListingModal";

interface ServiceListTableProps {
  records: ServiceListing[];
  totalNumServiceListing: number;
  refetch(): void;
  page: number;
  sortStatus: DataTableSortStatus;
  onSortStatusChange: any;
  onPageChange(p: number): void;
}

const ServiceListTable = ({
  records,
  totalNumServiceListing,
  refetch,
  page,
  sortStatus,
  onSortStatusChange,
  onPageChange,
}: ServiceListTableProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteServiceListingMutation = useDeleteServiceListingById(queryClient);

  const handleDeleteService = async (serviceListingId: number) => {
    try {
      await deleteServiceListingMutation.mutateAsync(serviceListingId);
      refetch();
      notifications.show({
        message: "Service Successfully Deleted",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Service Listing", error),
      });
    }
  };

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
            render: (record) => <Text fw={500}>{record.title}</Text>,
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
              record.tags.map((tag, index) => (
                <Badge
                  key={tag.tagId}
                  color={isValidServiceListing(record) ? "blue" : "red"}
                  mr={index < record.tags.length - 1 ? 5 : 0}
                  /* Add margin right if not the last tag */
                >
                  {tag.name}
                </Badge>
              )),
          },
          {
            accessor: "basePrice",
            title: "Price ($)",
            textAlignment: "right",
            width: 100,
            sortable: true,
            render: (record) => {
              return formatNumber2Decimals(record.basePrice);
            },
          },
          {
            // actions
            accessor: "actions",
            title: "Actions",
            width: 150,
            textAlignment: "right",
            render: (service) => (
              <Group position="right">
                <div onClick={(e) => e.stopPropagation()}>
                  {" "}
                  <ViewActionButton
                    onClick={() => {
                      router.push(
                        `/business/listings/${service.serviceListingId}`,
                      );
                    }}
                  />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <DeleteActionButtonModal
                    title={`Are you sure you want to delete ${service.title}?`}
                    subtitle="The customer would no longer be able to view this service listing."
                    onDelete={() =>
                      handleDeleteService(service.serviceListingId)
                    }
                  />
                </div>
              </Group>
            ),
          },
        ]}
        records={records}
        withBorder
        withColumnBorders
        striped
        verticalSpacing="sm"
        highlightOnHover
        onRowClick={(record) =>
          router.push(`/business/listings/${record.serviceListingId}`)
        }
        idAccessor="serviceListingId"
        //sorting
        sortStatus={sortStatus}
        onSortStatusChange={onSortStatusChange}
        //pagination
        totalRecords={totalNumServiceListing}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
        rowStyle={({
          requiresBooking,
          calendarGroupId,
          duration,
          lastPossibleDate,
        }) => {
          const isValid =
            (requiresBooking ? calendarGroupId && duration : true) &&
            (lastPossibleDate ? new Date(lastPossibleDate) > new Date() : true);

          return isValid
            ? { cursor: "pointer" }
            : { color: "red", cursor: "pointer" };
        }}
      />
    </>
  );
};

export default ServiceListTable;
