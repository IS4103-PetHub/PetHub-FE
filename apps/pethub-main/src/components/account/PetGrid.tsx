import {
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Text,
  Transition,
  Center,
  Loader,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconGenderFemale,
  IconGenderMale,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  GenderEnum,
  PetTypeEnum,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import CenterLoader from "web-ui/shared/CenterLoader";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditActionButton from "web-ui/shared/EditActionButton";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { useDeletePetById, useGetPetsByPetOwnerId } from "@/hooks/pets";
import PetInfoModal from "./PetInfoModal";

interface PetGridProps {
  userId: number;
}

const PetGrid = ({ userId }: PetGridProps) => {
  /*
   * Component State
   */
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [selectedPet, setSelectedPet] = useState(null);
  const [isViewPetModalOpen, { close: closeView, open: openView }] =
    useDisclosure(false);
  const [isCreatePetModalOpen, { close: closeCreate, open: openCreate }] =
    useDisclosure(false);
  const [isUpdatePetModalOpen, { close: closeUpdate, open: openUpdate }] =
    useDisclosure(false);

  const {
    data: pets = [],
    isLoading,
    refetch: refetchPets,
  } = useGetPetsByPetOwnerId(userId);

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (pets.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const queryClient = useQueryClient();
  const deletePetMutation = useDeletePetById(queryClient);
  const handleDeletePet = async (petId: number) => {
    try {
      // DELETE PET
      await deletePetMutation.mutateAsync(petId);
      notifications.show({
        message: "Pet Profile Deleted",
        color: "green",
      });
      if (pets.length === 0) {
        setHasNoFetchedRecords(true);
      }
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Pet", error),
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

  const calculateAge = (dateOfBirth: any) => {
    const currentDate = new Date();
    const dob = new Date(dateOfBirth);
    let age = dayjs(currentDate).diff(dob, "years");

    if (age == 0) {
      age = dayjs(currentDate).diff(dob, "months");
      return `${age} month${age !== 1 ? "s" : ""}`;
    }
    return `${age} year${age > 1 ? "s" : ""}`;
  };

  const renderNoPetContent = () => {
    if (pets.length === 0) {
      if (isLoading) {
        return (
          <Box h={400} sx={{ verticalAlign: "center" }}>
            <Center h="100%" w="100%">
              <Loader opacity={0.5} />
            </Center>
          </Box>
        );
      }
      return (
        //overflowY hidden is to hide random double scrollbar
        <Box h={400} sx={{ verticalAlign: "center", overflowY: "hidden" }}>
          <Center h="100%" w="100%">
            <Transition
              mounted={hasNoFetchedRecords}
              transition="fade"
              duration={100}
            >
              {(styles) => (
                <div style={styles}>
                  <SadDimmedMessage
                    title="No pets"
                    subtitle="Click 'Add new pet' to create a new pet"
                  />
                </div>
              )}
            </Transition>
          </Center>
        </Box>
      );
    }
  };

  return (
    <>
      <Group position="apart">
        <Badge color="indigo" size="lg">
          {pets ? pets.length : ""} pet{pets.length > 1 ? "s" : ""} added
        </Badge>
        <Button
          size="sm"
          leftIcon={<IconPlus size="1.25rem" />}
          onClick={() => {
            openCreate();
          }}
        >
          Add new pet
        </Button>
      </Group>
      {renderNoPetContent()}
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
                        <IconGenderMale
                          size="1rem"
                          color="gray"
                          style={{ marginLeft: "-12px" }}
                        />
                      ) : (
                        <IconGenderFemale
                          size="1rem"
                          color="gray"
                          style={{ marginLeft: "-12px" }}
                        />
                      )}
                    </Group>
                    <Text>
                      {pet.dateOfBirth &&
                        `Age: ${calculateAge(pet.dateOfBirth)}`}
                    </Text>
                    <Text>
                      {pet.petWeight > 0 &&
                        `Weight: ${formatNumber2Decimals(pet.petWeight)} kg`}
                    </Text>
                    <Text>
                      {pet.microchipNumber &&
                        `Microchip No: ${pet.microchipNumber}`}
                    </Text>
                  </Card.Section>
                  <Card.Section style={{ height: "15%" }}>
                    <Group position="center">
                      <ViewActionButton
                        onClick={() => {
                          setSelectedPet(pet);
                          openView();
                        }}
                      />
                      <EditActionButton
                        onClick={() => {
                          setSelectedPet(pet);
                          openUpdate();
                        }}
                      />
                      <DeleteActionButtonModal
                        title={`Are you sure you want to delete ${pet.petName}?`}
                        subtitle="This action cannot be undone. This pet profile would be permanently deleted."
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

      {/* Update Pet */}
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
