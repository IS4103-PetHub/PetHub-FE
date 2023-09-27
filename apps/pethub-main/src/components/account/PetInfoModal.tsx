import {
  Button,
  Card,
  Container,
  FileInput,
  Group,
  List,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { formatStringToLetterCase } from "shared-utils";
import { GenderEnum, PetTypeEnum } from "@/types/constants";
import { Pet, PetPayload } from "@/types/types";

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
      petName: isNotEmpty("Name required."),
      petType: isNotEmpty("Pet Type required."),
      gender: isNotEmpty("Gender required."),
      dateOfBirth: isNotEmpty("Date of Birth required."),
    },
  });

  const extractFileName = (attachmentKeys: string) => {
    return attachmentKeys.substring(attachmentKeys.lastIndexOf("-") + 1);
  };

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      return new File([buffer], fileName);
    } catch (error) {
      console.log("Error:", error);
    }
  };

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

    const pdfUrls = downloadedFiles.map((file) => URL.createObjectURL(file));
    setUploadedFiles(pdfUrls);
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

  const handleAction = async (values) => {
    try {
      const payload: PetPayload = {
        ...values,
      };
      if (isUpdating) {
        // update pet
        console.log("UPDATING", payload);
        notifications.show({
          message: "Pet Successfully Updated",
          color: "green",
          autoClose: 5000,
        });
      } else {
        // create pet
        console.log("CREATING", payload);
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
      setUploadedFiles([]);
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
        padding="xl"
      >
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
            <DateInput
              disabled={isViewing}
              label="Date of birth"
              placeholder="Date of birth"
              valueFormat="DD/MM/YYYY"
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
              label="Microchip number"
              placeholder="Pet Microchip number"
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
              accept="*/*"
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
                        href={URL.createObjectURL(file)}
                        download={file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ flex: "1", textDecoration: "none" }}
                      >
                        {file.name}
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
              <>
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
              </>
            )}
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default PetInfoModal;
