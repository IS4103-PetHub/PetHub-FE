import {
  Box,
  Button,
  Card,
  CloseButton,
  Container,
  FileInput,
  Group,
  Image,
  Stepper,
  Text,
  Textarea,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useState } from "react";
import {
  SupportTicketReason,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import SelectAppointment from "@/components/support/pet-owner/SelectAppointment";
import SelectOrderItem from "@/components/support/pet-owner/SelectOrderItem";
import SelectRefundRequests from "@/components/support/pet-owner/SelectRefundRequests";
import SelectServiceListing from "@/components/support/pet-owner/SelectServiceListing";
import {
  useGetSupportTickets,
  usePetOwnerCreateSupportTickets,
} from "@/hooks/support";
import { createSupportTicketPayload } from "@/types/types";

interface CreatePOSupportProps {
  userId: number;
  category?: string;
  memberSince: string;
}

export default function CreatePOSupport({
  userId,
  category,
  memberSince,
}: CreatePOSupportProps) {
  const {
    data: supportTickets = [],
    isLoading,
    refetch: refetchSupportTickets,
  } = useGetSupportTickets(userId);

  const router = useRouter();
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const isCategoryDisabled = ["GENERAL_ENQUIRY", "ACCOUNTS", "OTHERS"].includes(
    category,
  );
  const lastActiveStep = isCategoryDisabled ? 1 : 2;

  const [imagePreview, setImagePreview] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);

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

  const createPOSupportTicketMutation = usePetOwnerCreateSupportTickets();
  const handleSupportTicket = async () => {
    try {
      const values = supportTicketForm.values;
      const payload: createSupportTicketPayload = {
        reason: values.reason,
        supportCategory: values.supportCategory as SupportTicketReason,
        files: values.files,
        priority: categoryPriorityMapping[values.supportCategory],
        userId: userId,
        ...(values.serviceListingId && {
          serviceListingId: Number(values.serviceListingId),
        }),
        ...(values.orderItemId && { orderItemId: Number(values.orderItemId) }),
        ...(values.bookingId && { bookingId: Number(values.bookingId) }),
        ...(values.refundRequestId && {
          refundRequestId: Number(values.refundRequestId),
        }),
      };
      const createdSupportTicket =
        await createPOSupportTicketMutation.mutateAsync(payload);
      refetchSupportTickets();
      router.push(`/customer/support/${createdSupportTicket.supportTicketId}`);
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Creating Support Ticket", error),
      });
    }
  };

  const initialValues = {
    reason: "",
    supportCategory: category,
    priority: categoryPriorityMapping[category],
    serviceListingId: "",
    orderItemId: "",
    bookingId: "",
    refundRequestId: "",
    files: [],
  };

  type SupportTicketFormValues = typeof supportTicketForm.values;
  const supportTicketForm = useForm({
    initialValues: initialValues,
    validate: {
      reason: isNotEmpty("Description is required."),
      supportCategory: isNotEmpty("Category is required."),
      priority: isNotEmpty("Priority is required."),
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

  return (
    <>
      <Head>
        <title>Create Support - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container mt={50} size="60vw" sx={{ overflow: "hidden" }}>
          <LargeBackButton
            text="Back to Support Tickets"
            onClick={() => router.push("/customer/support")}
            size="sm"
            mb="md"
            variant="light"
          />
          <Group position="apart">
            <Box mb={50}>
              <PageTitle title="Create support ticket" />
              <Text color="dimmed">
                Describe your enquiry and upload supporting images if needed.
              </Text>
            </Box>
          </Group>
          <Stepper active={active}>
            {!isCategoryDisabled && (
              <Stepper.Step
                label={
                  category === "PAYMENTS"
                    ? "Select corresponding order"
                    : `Select ${formatStringToLetterCase(category)
                        .toLowerCase()
                        .substring(0, category.length - 1)}`
                }
              >
                {category === "SERVICE_LISTINGS" && (
                  <SelectServiceListing form={supportTicketForm} />
                )}
                {category === "ORDERS" && (
                  <SelectOrderItem form={supportTicketForm} userId={userId} />
                )}
                {category === "APPOINTMENTS" && (
                  <SelectAppointment
                    form={supportTicketForm}
                    userId={userId}
                    memberSince={memberSince}
                  />
                )}
                {category === "REFUNDS" && (
                  <SelectRefundRequests
                    form={supportTicketForm}
                    userId={userId}
                  />
                )}
                {category === "PAYMENTS" && (
                  <SelectOrderItem form={supportTicketForm} userId={userId} />
                )}
              </Stepper.Step>
            )}
            <Stepper.Step label="Enter description">
              <Textarea
                minRows={8}
                placeholder="Describe your enquiry."
                label="Description"
                mb="xl"
                withAsterisk
                {...supportTicketForm.getInputProps("reason")}
              />
            </Stepper.Step>
            <Stepper.Step label="Upload images (optional)">
              <FileInput
                placeholder={
                  imagePreview.length == 0
                    ? "No file selected"
                    : "Upload new images"
                }
                accept="image/*"
                name="images"
                label="Images"
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
                    <div
                      key={index}
                      style={{ flex: "0 0 calc(33.33% - 10px)" }}
                    >
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
            </Stepper.Step>
          </Stepper>

          <Group position="right" mt="xl">
            {active !== 0 && (
              <Button
                variant="default"
                onClick={prevStep}
                size="md"
                leftIcon={<IconChevronLeft size="1rem" />}
              >
                Back
              </Button>
            )}
            {active != lastActiveStep ? (
              <Button
                onClick={nextStep}
                size="md"
                rightIcon={<IconChevronRight size="1rem" />}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSupportTicket} size="md">
                Create
              </Button>
            )}
          </Group>
        </Container>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return null;

  const userId = session.user["userId"];
  const memberSince = session.user["dateCreated"];
  const { category } = context.query;

  return { props: { userId, category: String(category), memberSince } };
}
