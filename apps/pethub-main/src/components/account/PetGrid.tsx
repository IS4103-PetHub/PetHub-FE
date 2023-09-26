import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { TransformedValues, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { formatStringToLetterCase } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditActionButton from "web-ui/shared/EditActionButton";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { Pet } from "@/types/types";
import PetInfoModal from "./PetInfoModal";

interface PetGridProps {
  pets: Pet[];
  userId: number;
}

const PetGrid = ({ pets, userId }: PetGridProps) => {
  /*
   * Component State
   */
  const [selectedPet, setSelectedPet] = useState(null);
  const [isViewPetModalOpen, { close: closeView, open: openView }] =
    useDisclosure(false);
  const [isCreatePetModalOpen, { close: closeCreate, open: openCreate }] =
    useDisclosure(false);
  const [isUpdatePetModalOpen, { close: closeUpdate, open: openUpdate }] =
    useDisclosure(false);

  const handleDeletePet = async (petId: number) => {
    try {
      // DELETE PET

      notifications.show({
        message: "Pet Successfully Deleted",
        color: "green",
        autoClose: 5000,
      });
    } catch (error) {
      notifications.show({
        title: "Error Deleting Pets",
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
      <Group position="right">
        <Button
          size="md"
          leftIcon={<IconPlus size="1.25rem" />}
          onClick={() => {
            openCreate();
            console.log(isCreatePetModalOpen);
            console.log("Creating Pet");
          }}
        >
          Create New Pet
        </Button>
      </Group>

      {/* TODO: if no records render sadface */}

      <Grid
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        }}
      >
        {pets.map((pet) => (
          <Box key={pet.petId} style={{ margin: "20px", height: "300px" }}>
            {/* PET CARD */}
            <Card
              bg="lg"
              withBorder
              shadow="sm"
              padding="lg"
              radius="md"
              style={{ height: "100%" }}
            >
              <Card.Section withBorder style={{ height: "15%" }}>
                <Group mt="md" mb="xs" position="center">
                  <Text size="lg" fw="700">
                    {pet.petName}
                  </Text>
                </Group>
              </Card.Section>
              <Card.Section p="md" style={{ height: "70%" }}>
                <Text>{formatStringToLetterCase(pet.petType)}</Text>
                <Text>{`Gender: ${pet.gender}`}</Text>
                <Text>{`Date of Birth: ${pet.dateOfBirth || "N/A"}`}</Text>
                <Text>{`Weight: ${
                  pet.petWeight ? pet.petWeight.toFixed(2) + " kg" : "N/A"
                }`}</Text>
                <Text>{`Microchip Number: ${
                  pet.microchipNumber || "N/A"
                }`}</Text>
              </Card.Section>
              <Card.Section style={{ height: "15%" }}>
                <Group position="center">
                  <ViewActionButton
                    onClick={() => {
                      setSelectedPet(pet);
                      openView();
                      console.log("opening view", pet.petName);
                    }}
                  />
                  <EditActionButton
                    onClick={() => {
                      setSelectedPet(pet);
                      openUpdate();
                      console.log("opening edit", pet.petName);
                    }}
                  />
                  <DeleteActionButtonModal
                    title={`Are you sure you want to delete ${pet.petName}?`}
                    subtitle="The pet would be permanently deleted and cannot be recovered in the future"
                    onDelete={() => handleDeletePet(pet.petId)}
                  />
                </Group>
              </Card.Section>
            </Card>
          </Box>
        ))}
      </Grid>

      {/* Create Pet */}
      <PetInfoModal
        opened={isCreatePetModalOpen}
        onClose={closeCreate}
        isView={false}
        isUpdate={false}
        pet={null}
        userId={userId}
      />

      {/* View Pet */}
      <PetInfoModal
        opened={isViewPetModalOpen}
        onClose={closeView}
        isView={true}
        isUpdate={false}
        pet={selectedPet}
        userId={userId}
      />

      {/* View Pet */}
      <PetInfoModal
        opened={isUpdatePetModalOpen}
        onClose={closeUpdate}
        isView={false}
        isUpdate={true}
        pet={selectedPet}
        userId={userId}
      />
    </>
  );
};

export default PetGrid;
