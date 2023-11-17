import {
  Button,
  Card,
  CloseButton,
  FileInput,
  Group,
  Image,
  Modal,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import {
  SupportTicketReason,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import { usePetBusinessCreateSupportTickets } from "@/hooks/support";
import { createSupportTicketPayload } from "@/types/types";

interface CreateSupportModalProps {
  userId: number;
  refetch(): void;
}

export default function CreateSupportModal({
  userId,
  refetch,
}: CreateSupportModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const supportReasonOptions = Object.values(SupportTicketReason).map(
    (value) => ({
      label: formatStringToLetterCase(value),
      value,
    }),
  );

  const initialValues = {
    reason: "",
    supportCategory: "",
    priority: "",
    files: [],
  };

  type SupportTicketFormValues = typeof supportTicketForm.values;
  const supportTicketForm = useForm({
    initialValues: initialValues,
    validate: {
      reason: isNotEmpty("Reason is mandatory."),
      supportCategory: isNotEmpty("Category is mandatory"),
      priority: isNotEmpty("Priority is mandatory"),
    },
  });

  const handleFileInputChange = (files: File[] | null) => {
    if (files && files.length > 0) {
      const newImageUrls = files.map((file) => URL.createObjectURL(file));
      imagePreview.push(...newImageUrls);
      const updatedFiles = [...supportTicketForm.values.files, ...files];

      setImagePreview(imagePreview);
      supportTicketForm.setValues({
        ...supportTicketForm.values,
        files: updatedFiles,
      });
    } else {
      setImagePreview([]);
      supportTicketForm.setValues({
        ...supportTicketForm.values,
        files: [],
      });
    }
    setFileInputKey((prevKey) => prevKey + 1);
  };

  const removeImage = (indexToRemove) => {
    const updatedImagePreview = [...imagePreview];
    updatedImagePreview.splice(indexToRemove, 1);
    setImagePreview(updatedImagePreview);

    const updatedFiles = [...supportTicketForm.values.files];
    updatedFiles.splice(indexToRemove, 1);
    supportTicketForm.setValues({
      ...supportTicketForm.values,
      files: updatedFiles,
    });
  };

  const closeAndResetForm = async () => {
    supportTicketForm.reset();
    setImagePreview([]);
    close();
  };

  const categoryPriorityMapping = {
    GENERAL_ENQUIRY: "LOW",
    SERVICE_LISTINGS: "MEDIUM",
    ORDERS: "HIGH",
    APPOINTMENTS: "MEDIUM",
    PAYMENTS: "HIGH",
    ACCOUNTS: "LOW",
    REFUNDS: "MEDIUM",
    OTHERS: "LOW",
  };

  const createPBSupportTicketMutation = usePetBusinessCreateSupportTickets();
  const handleAction = async () => {
    try {
      const values = supportTicketForm.values;
      const payload: createSupportTicketPayload = {
        reason: values.reason,
        supportCategory: values.supportCategory as SupportTicketReason,
        files: values.files,
        priority: categoryPriorityMapping[values.supportCategory],
        userId: userId,
      };
      await createPBSupportTicketMutation.mutateAsync(payload);
      refetch();
      closeAndResetForm();
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Creating Service Listing", error),
      });
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeAndResetForm}
        size="80vh"
        padding="xl"
        title="Create Support Ticket"
        centered
      >
        <form>
          <TextInput
            placeholder="Input Reason"
            label="Reason"
            mb="xl"
            withAsterisk
            {...supportTicketForm.getInputProps("reason")}
          />
          <Select
            label="Category"
            placeholder="Pick one Category"
            mb="xl"
            data={supportReasonOptions}
            dropdownPosition="bottom"
            withAsterisk
            {...supportTicketForm.getInputProps("supportCategory")}
          />
          <FileInput
            placeholder={
              imagePreview.length == 0
                ? "No file selected"
                : "Upload new images"
            }
            accept="image/*"
            name="images"
            label="Attachments"
            multiple
            onChange={(files) => handleFileInputChange(files)}
            capture={false}
            key={fileInputKey}
            mb="xl"
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {imagePreview &&
              imagePreview.length > 0 &&
              imagePreview.map((imageUrl, index) => (
                <div key={index} style={{ flex: "0 0 calc(33.33% - 10px)" }}>
                  <Card style={{ maxWidth: "100%" }} mt="xs" mb="xl">
                    <Group position="right">
                      <CloseButton
                        size="md"
                        color="red"
                        mb="xs"
                        onClick={() => removeImage(index)}
                      />
                    </Group>
                    <Image
                      src={imageUrl}
                      alt={`Image Preview ${index}`}
                      style={{ maxWidth: "100%", display: "block" }}
                      mb="xs"
                    />
                  </Card>
                </div>
              ))}
          </div>
          <Text size="sm" mb="xl" color="gray">
            Please wait while our dedicated support team assist you. Please
            expect a response within 5 working days.
          </Text>
          <Group position="right">
            <Button
              type="reset"
              color="gray"
              onClick={() => {
                closeAndResetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={async () => handleAction()}>Create</Button>
          </Group>
        </form>
      </Modal>
      <LargeCreateButton mb="lg" text="Create Support Ticket" onClick={open} />
    </>
  );
}
