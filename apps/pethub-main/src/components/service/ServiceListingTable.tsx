import { Container, Modal, Paper, Table, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconEye,
  IconPencil,
  IconTrashFilled,
  IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
  const handleDeleteService = async () => {
    try {
      const result = await deleteServiceListingMutation.mutateAsync(
        selectedService.serviceListingId,
      );
      notifications.show({
        message: "Service Successfully Deleted",
        color: "green",
        autoClose: 5000,
      });
      closeDelete();
      refetch();
    } catch (error) {
      notifications.show({
        title: "Error Deleting Account",
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

  const rows = serviceListings
    ? serviceListings.map((listing) => (
        <tr key={listing.serviceListingId}>
          <td>{listing.title}</td>
          <td>{listing.description}</td>
          <td>{listing.category}</td>
          <td>${listing.basePrice.toFixed(2)}</td>
          <td>
            <ul>
              {listing.tags.map((tag) => (
                <li key={tag.tagId}>{tag.name}</li>
              ))}
            </ul>
          </td>
          <td>
            <Button.Group orientation="vertical">
              <Button
                onClick={() => {
                  setSelectedService(listing);
                  openView();
                }}
                leftIcon={<IconEye />}
                variant="light"
              >
                View
              </Button>
              <Button
                onClick={() => {
                  setSelectedService(listing);
                  openUpdate();
                }}
                leftIcon={<IconPencil />}
                variant="light"
              >
                Update
              </Button>
              <Button
                onClick={() => {
                  setSelectedService(listing);
                  openDelete();
                }}
                leftIcon={<IconTrashFilled />}
                variant="light"
                color="red"
              >
                Delete
              </Button>
            </Button.Group>
          </td>
        </tr>
      ))
    : [];

  return (
    <>
      <Table highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Base Price</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

      {/* Update */}
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

      {/* Delete */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={closeDelete}
        centered
        size="50%"
        title="Are you sure you want to delete this service listing?"
      >
        <Button variant="danger" onClick={handleDeleteService}>
          Yes, Delete
        </Button>
        <Button variant="outline" onClick={closeDelete}>
          Cancel
        </Button>
      </Modal>
    </>
  );
};

export default ServiceListTable;
