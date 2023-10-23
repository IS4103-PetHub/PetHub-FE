import {
  Button,
  Card,
  FileInput,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCalendar } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  GenderEnum,
  Pet,
  PetTypeEnum,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import { useCreatePet, useUpdatePet } from "@/hooks/pets";
import { PetPayload } from "@/types/types";

interface PetInfoModalProps {
  opened: boolean;
  onClose(): void;
  isView: boolean;
  isUpdate: boolean;
  pet?: Pet;
  userId: number;
  refetch(): void;
}

const PetInfoModal = ({
  opened,
  onClose,
  isView,
  isUpdate,
  pet,
  userId,
  refetch,
}: PetInfoModalProps) => {
  const [isUpdating, setUpdating] = useState(isUpdate);
  const [isViewing, setViewing] = useState(isView);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    const fetchAndSetPetFields = async () => {
      if (pet) {
        await setPetFields();
      }
    };
    fetchAndSetPetFields();
  }, [pet]);

  const handleFileInputChange = (files) => {
    if (files && files.length > 0) {
      const updatedFiles = [...uploadedFiles, ...files];
      setUploadedFiles(updatedFiles);
      form.setValues({
        ...form.values,
        healthAttachment: updatedFiles,
      });
    } else {
      setUploadedFiles([]);
      form.setValues({
        ...form.values,
        healthAttachment: [],
      });
    }
    setFileInputKey((prevKey) => prevKey + 1);
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(indexToRemove, 1);
    setUploadedFiles(updatedFiles);

    const pdfFiles = [...form.values.healthAttachment];
    pdfFiles.splice(indexToRemove, 1);
    form.setValues({
      ...form.values,
      healthAttachment: pdfFiles,
    });
  };

  const formDefaultValues = {
    petName: pet ? pet.petName : "",
    petType: pet ? pet.petType : "",
    gender: pet ? pet.gender : "",
    petWeight: pet && pet.petWeight ? pet.petWeight : 0,
    dateOfBirth: pet ? new Date(pet.dateOfBirth) : "",
    microchipNumber: pet && pet.microchipNumber ? pet.microchipNumber : "",
    healthAttachment: [],
  };

  const form = useForm({
    initialValues: formDefaultValues,
    validate: {
      petName: (value) => {
        const maxLength = 16;
        if (!value) {
          return "Name is required.";
        }
        if (value.length > maxLength) {
          return `Name must be ${maxLength} characters or less.`;
        }
      },
      petType: isNotEmpty("Pet Type required."),
      gender: isNotEmpty("Gender required."),
    },
  });

  const setPetFields = async () => {
    const fileNames = pet.attachmentKeys.map((keys) => extractFileName(keys));

    const downloadPromises = fileNames.map((filename, index) => {
      const url = pet.attachmentURLs[index];
      return downloadFile(url, filename).catch((error) => {
        console.error(`Error downloading file ${filename}:`, error);
        return null; // Return null for failed downloads
      });
    });

    const downloadedFiles: File[] = await Promise.all(downloadPromises);

    form.setValues({
      petName: pet ? pet.petName : "",
      petType: pet ? pet.petType : "",
      gender: pet ? pet.gender : "",
      petWeight: pet && pet.petWeight ? pet.petWeight : 0,
      dateOfBirth: pet ? new Date(pet.dateOfBirth) : "",
      microchipNumber: pet && pet.microchipNumber ? pet.microchipNumber : "",
      healthAttachment: downloadedFiles,
    });
    setUploadedFiles(downloadedFiles);
  };

  const closeAndResetForm = async () => {
    if (isUpdating || isViewing) {
      await setPetFields();
    } else {
      form.reset();
      setUploadedFiles([]);
    }
    setUpdating(isUpdate);
    setViewing(isView);
    onClose();
  };

  /*
   * Service Handlers
   */

  const createPetMutation = useCreatePet();
  const updatePetMutation = useUpdatePet();
  const handleAction = async (values) => {
    try {
      if (isUpdating) {
        const payload: PetPayload = {
          ...values,
          petOwnerId: userId.toString(),
          petId: pet.petId.toString(),
          weight: values.petWeight,
          files: values.healthAttachment,
        };
        // update pet
        await updatePetMutation.mutateAsync(payload);
        notifications.show({
          message: "Pet Successfully Updated",
          color: "green",
        });
      } else {
        const payload: PetPayload = {
          ...values,
          petOwnerId: userId.toString(),
          weight: values.petWeight,
          files: values.healthAttachment,
        };
        // create pet
        await createPetMutation.mutateAsync(payload);
        notifications.show({
          message: "Pet Successfully Created",
          color: "green",
        });
      }
      refetch();
      form.reset();
      closeAndResetForm();
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps(
          isUpdating ? "Error Updating Pet" : "Error Creating Pet",
          error,
        ),
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

  const extractFileName = (attachmentKeys: string) => {
    return attachmentKeys.substring(attachmentKeys.lastIndexOf("-") + 1);
  };

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to download file: ${response.status} ${response.statusText}`,
        );
      }
      const buffer = await response.arrayBuffer();
      return new File([buffer], fileName);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeAndResetForm}
        title="Pet Profile"
        centered
        size="lg"
      >
        <form onSubmit={form.onSubmit((values) => handleAction(values))}>
          <Stack m="xs" mt={0}>
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
              placeholder="Select pet type"
              data={petTypeOptions}
              {...form.getInputProps("petType")}
            />
            <Select
              withAsterisk
              disabled={isViewing}
              label="Gender"
              placeholder="Select pet gender"
              data={genderOptions}
              {...form.getInputProps("gender")}
            />
            <DateInput
              disabled={isViewing}
              label="Date of Birth"
              clearable
              placeholder="Date of birth"
              valueFormat="DD-MM-YYYY"
              maxDate={new Date()}
              icon={<IconCalendar size="1rem" />}
              {...form.getInputProps("dateOfBirth")}
            />
            <NumberInput
              disabled={isViewing}
              label="Weight (kg)"
              min={0}
              precision={2}
              {...form.getInputProps("petWeight")}
            />
            <TextInput
              disabled={isViewing}
              label="Microchip Number"
              placeholder="Pet microchip number"
              {...form.getInputProps("microchipNumber")}
            />
            <FileInput
              disabled={isViewing}
              label="Upload Files"
              placeholder={
                uploadedFiles.length === 0
                  ? "No file selected"
                  : "Upload new files"
              }
              accept="application/pdf"
              multiple
              onChange={(files) => handleFileInputChange(files)}
              key={fileInputKey}
            />
            {uploadedFiles.length > 0 && (
              <div>
                <h4>Uploaded Health Attachments:</h4>
                {uploadedFiles.map((file, index) => (
                  <Card key={index} shadow="xs" style={{ marginBottom: "8px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <a
                        href={file ? URL.createObjectURL(file) : ""}
                        download={file ? file.name : ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ flex: "1", textDecoration: "none" }}
                      >
                        {file ? file.name : ""}
                      </a>{" "}
                      {!isViewing && (
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {!isViewing && (
              <Group position="right" mt="sm">
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
                <Button type="submit">{isUpdating ? "Save" : "Create"}</Button>
              </Group>
            )}

            {isViewing && (
              <Group position="right" mt="md">
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
            )}
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default PetInfoModal;
