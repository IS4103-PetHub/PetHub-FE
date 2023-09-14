import { Container, Modal, Paper, Group, Button, Badge } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconEye,
  IconPencil,
  IconTrashFilled,
  IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import { useState } from "react";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditActionButton from "web-ui/shared/EditActionButton";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { useDeleteServiceListingById } from "@/hooks/serviceListingHooks";
import { ServiceListing } from "@/types/types";
import ServiceListingModal from "./ServiceListingModal";

interface ServiceListTableProps {
  serviceListings?: ServiceListing[];
  userId: number;
  refetch(): void;
}

const ServiceListTable = ({
  serviceListings,
  userId,
  refetch,
}: ServiceListTableProps) => {
  const [selectedService, setSelectedService] = useState(null);
  const [isServiceModalOpen, { close: closeView, open: openView }] =
    useDisclosure(false);
  const [isUpdateModalOpen, { close: closeUpdate, open: openUpdate }] =
    useDisclosure(false);
  const [isDeleteModalOpen, { close: closeDelete, open: openDelete }] =
    useDisclosure(false);

  const queryClient = useQueryClient();
  const deleteServiceListingMutation = useDeleteServiceListingById(queryClient);
  const handleDeleteService = async (serviceListingId: number) => {
    try {
      const result =
        await deleteServiceListingMutation.mutateAsync(serviceListingId);
      notifications.show({
        message: "Service Successfully Deleted",
        color: "green",
        autoClose: 5000,
      });
      closeDelete();
      refetch();
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
        minHeight={150}
        columns={[
          {
            accessor: "title",
            title: "Title",
            textAlignment: "left",
            width: "10vw", // Width in viewport width (vw) units
            sortable: true,
          },
          {
            accessor: "description",
            title: "Description",
            textAlignment: "left",
            width: "30vw",
            sortable: true,
            render: (record) => (
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                }}
              >
                {record.description}
              </div>
            ),
          },
          {
            accessor: "basePrice",
            title: "Price",
            textAlignment: "left",
            width: "10vw", // Width in viewport width (vw) units
            sortable: true,
            render: (record) => {
              return `$ ${record.basePrice.toFixed(2)}`;
            },
          },
          {
            accessor: "category",
            title: "Category",
            textAlignment: "left",
            width: "10vw", // Width in viewport width (vw) units
            sortable: true,
            render: (record) =>
              record.category
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase()),
          },
          {
            accessor: "tags",
            title: "Tags",
            textAlignment: "left",
            width: "10vw", // Width in viewport width (vw) units
            render: (record) =>
              record.tags.length > 0 ? (
                record.tags.map((tag) => (
                  <Badge key={tag.tagId} color="blue">
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <Badge color="gray">No tags</Badge>
              ),
          },
          {
            // actions
            accessor: "",
            title: "Actions",
            width: "10vw", // Width in viewport width (vw) units
            render: (service) => (
              <Group>
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
                  subtitle="The customer would no longer be able to view this Service."
                  onDelete={() => handleDeleteService(service.serviceListingId)}
                />
              </Group>
            ),
          },
        ]}
        records={serviceListings}
        withBorder
        withColumnBorders
        striped
        verticalSpacing="sm"
        idAccessor="serviceListingId"
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
      />
    </>
  );
};

export default ServiceListTable;
