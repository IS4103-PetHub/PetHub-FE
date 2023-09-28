import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { TransformedValues, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconGenderFemale,
  IconGenderMale,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { formatStringToLetterCase } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditActionButton from "web-ui/shared/EditActionButton";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { useDeletePetById, useGetPetsByPetOwnerId } from "@/hooks/pets";
import { GenderEnum, PetTypeEnum } from "@/types/constants";
import { Pet } from "@/types/types";
import PetInfoModal from "./PetInfoModal";

interface PetGridProps {
  userId: number;
}

const PetGrid = ({ userId }: PetGridProps) => {
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

  const { data: pets, refetch: refetchPets } = useGetPetsByPetOwnerId(userId);

  const queryClient = useQueryClient();
  const deletePetMutation = useDeletePetById(queryClient);
  const handleDeletePet = async (petId: number) => {
    try {
      // DELETE PET
      const result = await deletePetMutation.mutateAsync(petId);
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

  const petTypeIcons = {
    [PetTypeEnum.Dog]: "/icons8-dog.png",
    [PetTypeEnum.Cat]: "/icons8-cat.png",
    [PetTypeEnum.Bird]: "/icons8-bird.png",
    [PetTypeEnum.Terrapin]: "/icons8-turtle.png",
    [PetTypeEnum.Rabbit]: "/icons8-rabbit.png",
    [PetTypeEnum.Rodent]: "/icons8-rat.png",
    [PetTypeEnum.Others]: "/icons8-veterinarian.png",
  };

  const renderPetTypeIcon = (petType) => {
    const iconPath = petTypeIcons[petType];
    if (iconPath) {
      return <img src={iconPath} alt={petType} />;
    }
    return null; // Return null if no icon is found for the pet type
  };

  const calculateAge = (dateOfBirth) => {
    const currentDate = new Date();
    const dob = new Date(dateOfBirth);
    let age = currentDate.getFullYear() - dob.getFullYear();
    if (
      currentDate.getMonth() < dob.getMonth() ||
      (currentDate.getMonth() === dob.getMonth() &&
        currentDate.getDate() < dob.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <>
      <Group position="apart">
        <Badge color="indigo" radius="xl" size="xl">
          {pets ? pets.length : ""} pets added
        </Badge>
        <Button
          size="xs"
          leftIcon={<IconPlus size="1.25rem" />}
          onClick={() => {
            openCreate();
            console.log(isCreatePetModalOpen);
            console.log("Creating Pet");
          }}
        >
          Add new Pet
        </Button>
      </Group>

      {/* TODO: if no records render sadface */}

      <Grid
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        }}
      >
        {pets
          ? pets.map((pet) => (
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
                      {renderPetTypeIcon(pet.petType)}
                      <Text size="lg" fw="700">
                        {pet.petName}
                      </Text>
                    </Group>
                  </Card.Section>
                  <Card.Section p="md" style={{ height: "70%" }}>
                    <Badge fullWidth color="gray" size="lg" mb={5}>
                      {formatStringToLetterCase(pet.petType)}
                    </Badge>
                    <Group>
                      <Text>
                        {`Gender: ${formatStringToLetterCase(pet.gender)}`}
                      </Text>
                      {pet.gender === GenderEnum.Male ? (
                        <IconGenderMale size="1rem" color="gray" />
                      ) : (
                        <IconGenderFemale size="1rem" color="gray" />
                      )}
                    </Group>
                    <Text>
                      {pet.dateOfBirth
                        ? `Age: ${calculateAge(pet.dateOfBirth)}`
                        : ""}
                    </Text>
                    <Text>
                      {pet.petWeight !== null && pet.petWeight !== undefined
                        ? `Weight: ${pet.petWeight.toFixed(2)} kg`
                        : ""}
                    </Text>
                    <Text>
                      {pet.microchipNumber
                        ? `Microchip Number: ${pet.microchipNumber}`
                        : ""}
                    </Text>
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
                        subtitle="This action cannot be undone. The pet would be permanently deleted."
                        onDelete={() => handleDeletePet(pet.petId)}
                      />
                    </Group>
                  </Card.Section>
                </Card>
              </Box>
            ))
          : []}
      </Grid>

      {/* Create Pet */}
      <PetInfoModal
        opened={isCreatePetModalOpen}
        onClose={closeCreate}
        isView={false}
        isUpdate={false}
        pet={null}
        userId={userId}
        refetch={refetchPets}
      />

      {/* View Pet */}
      <PetInfoModal
        opened={isViewPetModalOpen}
        onClose={closeView}
        isView={true}
        isUpdate={false}
        pet={selectedPet}
        userId={userId}
        refetch={refetchPets}
      />

      {/* View Pet */}
      <PetInfoModal
        opened={isUpdatePetModalOpen}
        onClose={closeUpdate}
        isView={false}
        isUpdate={true}
        pet={selectedPet}
        userId={userId}
        refetch={refetchPets}
      />
    </>
  );
};

export default PetGrid;
