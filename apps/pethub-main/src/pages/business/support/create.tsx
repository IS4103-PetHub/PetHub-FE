import {
  Button,
  Card,
  CloseButton,
  Container,
  FileInput,
  Grid,
  Group,
  Image,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useState } from "react";
import {
  AccountStatusEnum,
  SupportTicketReason,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
import PBCannotAccessMessage from "@/components/common/PBCannotAccessMessage";
import CreateSupportBookingItemTable from "@/components/support/CreateSupportBookingItemTable";
import CreateSupportOrderItemTable from "@/components/support/CreateSupportOrderItemTable";
import CreateSupportPaymentItemTable from "@/components/support/CreateSupportPaymentItemTable";
import CreateSupportRefundItemTable from "@/components/support/CreateSupportRefundItemTable";
import CreateSupportServiceListingTable from "@/components/support/CreateSupportServiceListingTable";
import {
  useGetSupportTickets,
  usePetBusinessCreateSupportTickets,
} from "@/hooks/support";
import { PetBusiness, createSupportTicketPayload } from "@/types/types";

interface CreatePBSupportProps {
  userId: number;
  canView: boolean;
}

export default function CreatePBSupport({ userId, canView }) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const {
    data: supportTickets = [],
    isLoading,
    refetch: refetchSupportTickets,
  } = useGetSupportTickets(userId);

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
    serviceListingId: "",
    orderItemId: "",
    bookingId: "",
    payoutInvoiceId: "",
    refundRequestId: "",
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

  function renderServiceListingInput() {
    return (
      <>
        <Grid.Col span={12}>
          <CreateSupportServiceListingTable
            userId={userId}
            form={supportTicketForm}
          />
        </Grid.Col>
      </>
    );
  }

  function renderOrderItemInput() {
    return (
      <>
        <Grid.Col span={12}>
          <CreateSupportOrderItemTable
            userId={userId}
            form={supportTicketForm}
          />
        </Grid.Col>
      </>
    );
  }

  function renderAppointmentItemInput() {
    return (
      <>
        <Grid.Col span={12}>
          <CreateSupportBookingItemTable
            userId={userId}
            form={supportTicketForm}
          />
        </Grid.Col>
      </>
    );
  }

  function renderPaymentItemInput() {
    return (
      <>
        <Grid.Col span={12}>
          <CreateSupportPaymentItemTable
            userId={userId}
            form={supportTicketForm}
          />
        </Grid.Col>
      </>
    );
  }

  function renderRefundItemInput() {
    return (
      <>
        <Grid.Col span={12}>
          <CreateSupportRefundItemTable
            userId={userId}
            form={supportTicketForm}
          />
        </Grid.Col>
      </>
    );
  }

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
        ...(values.serviceListingId && {
          serviceListingId: Number(values.serviceListingId),
        }),
        ...(values.orderItemId && { orderItemId: Number(values.orderItemId) }),
        ...(values.bookingId && { bookingId: Number(values.bookingId) }),
        ...(values.payoutInvoiceId && {
          payoutInvoiceId: Number(values.payoutInvoiceId),
        }),
        ...(values.refundRequestId && {
          refundRequestId: Number(values.refundRequestId),
        }),
      };
      console.log(payload);
      const createdSupportTicket =
        await createPBSupportTicketMutation.mutateAsync(payload);
      refetchSupportTickets();
      closeAndResetForm();
      router.push(`/business/support/${createdSupportTicket.supportTicketId}`);
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Creating Support Ticket", error),
      });
    }
  };

  const clearIds = (values) => {
    return {
      ...values,
      serviceListingId: "",
      orderItemId: "",
      bookingId: "",
      payoutInvoiceId: "",
      refundRequestId: "",
    };
  };

  return (
    <>
      <Head>
        <title>Create Support Ticket - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {!canView ? (
        <PBCannotAccessMessage />
      ) : (
        <Container mt="xl" mb="xl">
          <LargeBackButton
            size="sm"
            text="Back to Support Tickets"
            onClick={() => router.push("/business/support")}
            mb="md"
          />
          <PageTitle title="Create Support Ticket" />

          <form>
            <Grid>
              <Grid.Col span={12}>
                <Select
                  label="Category"
                  placeholder="Pick one Category"
                  mb="xl"
                  data={supportReasonOptions}
                  dropdownPosition="bottom"
                  withAsterisk
                  {...supportTicketForm.getInputProps("supportCategory")}
                  onClick={() => {
                    const clearedValues = clearIds(supportTicketForm.values);
                    supportTicketForm.setValues(clearedValues);
                  }}
                />
              </Grid.Col>
              {supportTicketForm.values.supportCategory == "SERVICE_LISTINGS" &&
                renderServiceListingInput()}
              {supportTicketForm.values.supportCategory == "ORDERS" &&
                renderOrderItemInput()}
              {supportTicketForm.values.supportCategory == "APPOINTMENTS" &&
                renderAppointmentItemInput()}
              {supportTicketForm.values.supportCategory == "PAYMENTS" &&
                renderPaymentItemInput()}
              {supportTicketForm.values.supportCategory == "REFUNDS" &&
                renderRefundItemInput()}
              <Grid.Col span={12}>
                <Textarea
                  placeholder="Input Reason"
                  label="Reason"
                  mb="xl"
                  withAsterisk
                  {...supportTicketForm.getInputProps("reason")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
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
              </Grid.Col>
              <Grid.Col span={12}>
                <Group position="right">
                  <Button
                    type="reset"
                    color="gray"
                    onClick={() => {
                      closeAndResetForm();
                    }}
                  >
                    Clear
                  </Button>
                  <Button onClick={async () => handleAction()}>Create</Button>
                </Group>
              </Grid.Col>
            </Grid>
          </form>
        </Container>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return null;

  const userId = session.user["userId"];
  const accountStatus = session.user["accountStatus"];
  const petBusiness = (await (
    await api.get(`/users/pet-businesses/${userId}`)
  ).data) as PetBusiness;

  const canView =
    accountStatus !== AccountStatusEnum.Pending &&
    petBusiness.petBusinessApplication;

  return { props: { userId, canView } };
}
