import {
  Button,
  Container,
  FileInput,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { formatStringToLetterCase } from "shared-utils";
import { GenderEnum, PetTypeEnum } from "@/types/constants";
import { Pet } from "@/types/types";

interface PetInfoModalProps {
  opened: boolean;
  onClose(): void;
  isView: boolean;
  isUpdate: boolean;
  pet?: Pet;
  userId: number;
}

const PetInfoModal = ({
  opened,
  onClose,
  isView,
  isUpdate,
  pet,
  userId,
}: PetInfoModalProps) => {
  const [isUpdating, setUpdating] = useState(isUpdate);
  const [isViewing, setViewing] = useState(isView);

  useEffect(() => {
    form.setValues(formDefaultValues);
  }, [pet]);

  const formDefaultValues = {
    petName: pet ? pet.petName : "",
    petType: pet ? pet.petType : "",
    gender: pet ? pet.gender : "",
    petWeight: pet ? pet.petWeight : 0,
    dateOfBirth: pet ? new Date(pet.dateOfBirth) : "",
    microchipNumber: pet ? pet.microchipNumber : "",
    healthAttachment: pet ? pet.healthAttachment : [],
  };

  const form = useForm({
    initialValues: formDefaultValues,
    validate: {
      // TODO: validation
    },
  });

  const setPetFields = async () => {
    // TODO: for file attachements need to convert from url to file
    // const files = pet.healthAttachment
    form.setValues({
      ...pet,
      dateOfBirth: new Date(pet.dateOfBirth),
    });
  };

  const closeAndResetForm = async () => {
    if (isUpdating || isViewing) {
      await setPetFields();
    } else {
      form.reset();
    }
    setUpdating(isUpdate);
    setViewing(isView);
    onClose();
  };

  const handleAction = async (values) => {
    try {
      if (isUpdating) {
        // update pet
        console.log("UPDATING", values);
        notifications.show({
          message: "Pet Successfully Updated",
          color: "green",
          autoClose: 5000,
        });
      } else {
        // create pet
        console.log("CREATING", values);
        notifications.show({
          message: "Pet Successfully Created",
          color: "green",
          autoClose: 5000,
        });
      }
      // TODO: need to refetch once updated/created
      form.reset();
      setUpdating(isUpdate);
      setViewing(isView);
      onClose();
    } catch (error) {
      notifications.show({
        title: isUpdating ? "Error Updating Pet" : "Error Creating Pet",
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

  /*
   * Helper Functions
   */
  const petTypeOptions = Object.values(PetTypeEnum).map((value) => ({
    value: value,
    label: formatStringToLetterCase(value),
  }));

  const genderOptions = Object.values(GenderEnum).map((value) => ({
    value: value,
    label: formatStringToLetterCase(value),
  }));

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeAndResetForm}
        title="Pet Profile"
        centered
        size="lg"
      >
        <Container fluid>
          <form onSubmit={form.onSubmit((values) => handleAction(values))}>
            <Stack>
              <TextInput
                withAsterisk
                disabled={isViewing}
                label="Name"
                placeholder="Pet name"
                {...form.getInputProps("petName")}
              />
              <Select
                withAsterisk
                disabled={isViewing}
                label="Type"
                placeholder="Pick one"
                data={petTypeOptions}
                {...form.getInputProps("petType")}
              />
              <Select
                withAsterisk
                disabled={isViewing}
                label="Gender"
                placeholder="Pick one"
                data={genderOptions}
                {...form.getInputProps("gender")}
              />
              <NumberInput
                disabled={isViewing}
                label="Weight (kg)"
                min={0}
                precision={2}
                {...form.getInputProps("petWeight")}
              />
              <DateInput
                disabled={isViewing}
                label="Date of birth"
                placeholder="Date of birth"
                valueFormat="DD/MM/YYYY"
                maxDate={new Date()}
                icon={<IconCalendar size="1rem" />}
                {...form.getInputProps("dateOfBirth")}
              />
              <TextInput
                disabled={isViewing}
                label="Microchip number"
                placeholder="Pet Microchip number"
                {...form.getInputProps("microchipNumber")}
              />
              {/* TODO: find out what kind of images */}
              {/* <FileInput
                                disabled={isViewing}
                                label="Upload healht documents"
                                multiple
                            /> */}
              {!isViewing && (
                <Group position="right" mt="sm" mb="sm">
                  {!isViewing && (
                    <Button
                      type="reset"
                      color="gray"
                      onClick={() => {
                        closeAndResetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit">
                    {isUpdating ? "Save" : "Create"}
                  </Button>
                </Group>
              )}

              {isViewing && (
                <>
                  <Group position="right" mt="md" mb="md">
                    <Button
                      type="button"
                      onClick={() => {
                        setUpdating(true);
                        setViewing(false);
                      }}
                    >
                      Edit
                    </Button>
                  </Group>
                </>
              )}
            </Stack>
          </form>
        </Container>
      </Modal>
    </>
  );
};

export default PetInfoModal;
