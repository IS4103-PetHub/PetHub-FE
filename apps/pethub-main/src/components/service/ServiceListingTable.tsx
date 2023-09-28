import { Container, Modal, Paper, Group, Button, Badge } from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconEye,
  IconPencil,
  IconTrashFilled,
  IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import React, { useState } from "react";
import { getMinTableHeight } from "shared-utils";
import { formatStringToLetterCase } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditActionButton from "web-ui/shared/EditActionButton";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { useDeleteServiceListingById } from "@/hooks/service-listing";
import { TABLE_PAGE_SIZE } from "@/types/constants";
import { Address, CalendarGroup, ServiceListing, Tag } from "@/types/types";
import ServiceListingModal from "./ServiceListingModal";

interface ServiceListTableProps {
  records: ServiceListing[];
  totalNumServiceListing: number;
  userId: number;
  refetch(): void;
  page: number;
  isSearching: boolean;
  sortStatus: DataTableSortStatus;
  onSortStatusChange: any;
  onPageChange(p: number): void;
  tags: Tag[];
  addresses: Address[];
  calendarGroup: CalendarGroup[];
}

const ServiceListTable = ({
  records,
  totalNumServiceListing,
  userId,
  refetch,
  page,
  isSearching,
  sortStatus,
  onSortStatusChange,
  onPageChange,
  tags,
  addresses,
  calendarGroup,
}: ServiceListTableProps) => {
  /*
   * Component State
   */
  const [selectedService, setSelectedService] = useState(null);
  const [isServiceModalOpen, { close: closeView, open: openView }] =
    useDisclosure(false);
  const [isUpdateModalOpen, { close: closeUpdate, open: openUpdate }] =
    useDisclosure(false);

  const queryClient = useQueryClient();
  const deleteServiceListingMutation = useDeleteServiceListingById(queryClient);

  /*
   * Service Handlers
   */
  const handleDeleteService = async (serviceListingId: number) => {
    try {
      const result =
        await deleteServiceListingMutation.mutateAsync(serviceListingId);
      notifications.show({
        message: "Service Successfully Deleted",
        color: "green",
        autoClose: 5000,
      });
    } catch (error) {
      notifications.show({
        title: "Error Deleting Service Listing",
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
              record.tags.map((tag, index) => (
                <React.Fragment key={tag.tagId}>
                  <Badge color="blue">{tag.name}</Badge>
                  {index < record.tags.length - 1 && "\u00A0"}{" "}
                  {/* Add space if not the last tag */}
                </React.Fragment>
              )),
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
            width: 150,
            textAlignment: "right",
            render: (service) => (
              <Group position="right">
                <ViewActionButton
                  onClick={function (): void {
                    setSelectedService(service);
                    openView();
                  }}
                />
                <EditActionButton
                  onClick={function (): void {
                    setSelectedService(service);
                    openUpdate();
                  }}
                />
                <DeleteActionButtonModal
                  title={`Are you sure you want to delete ${service.title}?`}
                  subtitle="The customer would no longer be able to view this service listing."
                  onDelete={() => handleDeleteService(service.serviceListingId)}
                />
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

      {/* View */}
      <ServiceListingModal
        opened={isServiceModalOpen}
        onClose={closeView}
        isView={true}
        isUpdate={false}
        serviceListing={selectedService}
        userId={userId}
        refetch={refetch}
        tags={tags}
        addresses={addresses ? addresses : []}
        calendarGroup={calendarGroup}
      />

      {/* Update */}
      <ServiceListingModal
        opened={isUpdateModalOpen}
        onClose={closeUpdate}
        isView={false}
        isUpdate={true}
        serviceListing={selectedService}
        userId={userId}
        refetch={refetch}
        tags={tags}
        addresses={addresses ? addresses : []}
        calendarGroup={calendarGroup}
      />
    </>
  );
};

export default ServiceListTable;