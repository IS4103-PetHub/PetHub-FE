import {
  MultiSelect,
  Button,
  Container,
  Grid,
  Textarea,
  TextInput,
  Group,
  FileInput,
  Text,
  SimpleGrid,
  Select,
  Alert,
  Badge,
} from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconSend,
  IconUpload,
  IconAlertCircle,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import FileMiniIcon from "@/components/common/file/FileMiniIcon";
import { PDFPreview } from "@/components/common/file/PDFPreview";
import { AddAddressModal } from "@/components/pbapplication/AddAddressModal";
import { AddressSidewaysScrollThing } from "@/components/pbapplication/AddressSidewaysScrollThing";
import ApplicationStatusBadge from "@/components/pbapplication/ApplicationStatusAlert";
import ApplicationStatusAlert from "@/components/pbapplication/ApplicationStatusAlert";
import {
  useCreatePetBusinessApplication,
  useGetPetBusinessApplicationByPBId,
  useUpdatePetBusinessApplication,
} from "@/hooks/pet-business-application";
import {
  AccountTypeEnum,
  BusinessApplicationStatusEnum,
  PetBusinessTypeEnum,
} from "@/types/constants";
import { Address, CreatePetBusinessApplicationPayload } from "@/types/types";
import { validateAddressName } from "@/util";

interface ApplicationProps {
  userId: number;
  accountType: AccountTypeEnum;
}

export default function Application({ userId, accountType }: ApplicationProps) {
  const [isAddAddressModalOpened, { open, close }] = useDisclosure(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const [isDisabled, setIsDisabled] = useState(false);

  const {
    data: petBusinessApplication,
    refetch: refetchPetBusinessApplication,
  } = useGetPetBusinessApplicationByPBId(userId);

  useEffect(() => {
    if (!petBusinessApplication) {
      setApplicationStatus(BusinessApplicationStatusEnum.Notfound);
      setIsDisabled(false);
    } else {
      console.log("BTYPE", petBusinessApplication.businessType);
      setApplicationStatus(petBusinessApplication.applicationStatus);
      applicationForm.setValues({
        businessType: petBusinessApplication.businessType,
        businessAddresses: petBusinessApplication.businessAddresses,
        businessEmail: petBusinessApplication.businessEmail,
        websiteURL: petBusinessApplication.websiteURL,
        businessDescription: petBusinessApplication.businessDescription,
        attachments: [], // Not handled by BE yet
      });
      setIsDisabled(
        petBusinessApplication.applicationStatus ===
          BusinessApplicationStatusEnum.Approved ||
          petBusinessApplication.applicationStatus ===
            BusinessApplicationStatusEnum.Pending,
      );
    }
    setLoading(false);
  }, [petBusinessApplication]);

  const businessTypeData = Object.entries(PetBusinessTypeEnum).map(
    ([key, value]) => ({
      value: value as string,
      label: value as string,
    }),
  );

  console.log("BTYPER DATA", businessTypeData);

  const applicationForm = useForm({
    initialValues: {
      businessType: "",
      businessAddresses: [],
      businessEmail: "",
      websiteURL: "",
      businessDescription: "",
      attachments: [],
    },

    validate: {
      businessType: (value) => (!value ? "Business type is required." : null),
      businessEmail: (value) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
          ? null
          : "Invalid or missing email.",
      businessAddresses: (value) => null,
      businessDescription: (value) =>
        !value ? "Business description is required." : null,
      websiteURL: (value) =>
        value && !/^(http|https):\/\/[^ "]+$/.test(value)
          ? "Website must start with http:// or https://"
          : null,
      attachments: (value) => null,
    },
  });

  const addressForm = useForm({
    initialValues: {
      addressName: "",
      line1: "",
      line2: "",
      postalCode: "",
    },
    validate: {
      addressName: (value) => validateAddressName(value),
      line1: (value) => (!value ? "Address is required." : null),
      postalCode: (value) =>
        !value ? "Address postal code is required." : null,
    },
  });

  /*
    The below 3 functions are for handling addresses
  */
  type addressFormValues = typeof addressForm.values;
  function handleAddAddress(values: addressFormValues) {
    const updatedAddresses = [
      ...applicationForm.values.businessAddresses,
      values,
    ];
    applicationForm.setValues({
      ...applicationForm.values,
      businessAddresses: updatedAddresses,
    });
    close();
    addressForm.reset();
  }

  function handleRemoveAddress(address: Address) {
    const updatedAddresses = applicationForm.values.businessAddresses.filter(
      (a) => a !== address,
    );
    applicationForm.setValues({
      ...applicationForm.values,
      businessAddresses: updatedAddresses,
    });
  }

  /*
    The below are for PDF file handling in the attachment dropzone
  */
  const previews = applicationForm.values.attachments.map((file, index) => {
    return (
      <PDFPreview
        key={file.name}
        file={file}
        onRemove={() => removePDF(index)}
      />
    );
  });

  const removePDF = (index: number) => {
    const newFiles = [...applicationForm.values.attachments];
    newFiles.splice(index, 1);
    applicationForm.setValues({
      ...applicationForm.values,
      attachments: newFiles,
    });
  };

  /*
    The below are for application submission and updating
  */

  const createPetBusinessApplicationMutation =
    useCreatePetBusinessApplication(queryClient);
  const createPetBusinessApplication = async (
    payload: CreatePetBusinessApplicationPayload,
  ) => {
    try {
      await createPetBusinessApplicationMutation.mutateAsync(payload);
      notifications.show({
        title: "Application Submitted",
        color: "green",
        icon: <IconCheck />,
        message: `Please wait for an administrator to review your application!`,
      });
      refetchPetBusinessApplication();
    } catch (error: any) {
      notifications.show({
        title: "Error submitting application",
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

  const updatePetBusinessApplicationMutation =
    useUpdatePetBusinessApplication(queryClient);
  const updatePetBusinessApplication = async (
    payload: CreatePetBusinessApplicationPayload,
  ) => {
    try {
      await updatePetBusinessApplicationMutation.mutateAsync(payload);
      notifications.show({
        title: "Application Updated",
        color: "green",
        icon: <IconCheck />,
        message: `Please wait for an administrator to review your application!`,
      });
      refetchPetBusinessApplication();
    } catch (error: any) {
      notifications.show({
        title: "Error updating application",
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

  type applicationFormValues = typeof applicationForm.values;
  function handleSubmit(values: applicationFormValues) {
    const payload: CreatePetBusinessApplicationPayload = {
      petBusinessId: userId,
      businessType: values.businessType as PetBusinessTypeEnum,
      businessEmail: values.businessEmail,
      websiteURL: values.websiteURL,
      businessDescription: values.businessDescription,
      businessAddresses: values.businessAddresses,
      attachments: [], // not handled by BE yet
    };
    if (applicationStatus === BusinessApplicationStatusEnum.Notfound) {
      createPetBusinessApplication(payload);
    } else if (applicationStatus === BusinessApplicationStatusEnum.Rejected) {
      payload.petBusinessApplicationId =
        petBusinessApplication.petBusinessApplicationId; // Attach the application ID
      updatePetBusinessApplication(payload);
    } else {
      notifications.show({
        title: "Error sending application",
        color: "red",
        icon: <IconX />,
        message: `Your application status is currently ${applicationStatus}.`,
      });
    }
  }

  return (
    <Container mt="50px" mb="xl">
      {petBusinessApplication &&
        applicationStatus !== BusinessApplicationStatusEnum.Notfound && (
          <ApplicationStatusAlert
            applicationStatus={applicationStatus}
            forDashboard={false}
            remarks={
              petBusinessApplication && petBusinessApplication.adminRemarks
            }
          />
        )}
      <Group position="left">
        <PageTitle title="Pet Business Application" />
        {applicationStatus !== BusinessApplicationStatusEnum.Notfound && (
          <Badge variant="gradient" gradient={{ from: "indigo", to: "cyan" }}>
            <>
              Application ID:{" "}
              {petBusinessApplication &&
                petBusinessApplication.petBusinessApplicationId}
            </>
          </Badge>
        )}
      </Group>
      <Text size="sm" color="dimmed">
        Apply to be a Pet Business Partner with us today!
      </Text>
      {!loading && (
        <form
          onSubmit={applicationForm.onSubmit((values: any) =>
            handleSubmit(values),
          )}
        >
          <Grid mt="sm" mb="sm" gutter="lg">
            <Grid.Col span={12}>
              <Select
                disabled={isDisabled}
                withAsterisk
                data={businessTypeData}
                label="Business type"
                placeholder="Select a business type"
                {...applicationForm.getInputProps("businessType")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                disabled={isDisabled}
                withAsterisk
                label="Business email"
                placeholder="example@email.com"
                {...applicationForm.getInputProps("businessEmail")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                disabled={isDisabled}
                placeholder="https://www.pet-groomer.com"
                label="Business website URL"
                {...applicationForm.getInputProps("websiteURL")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                disabled={isDisabled}
                withAsterisk
                placeholder="Description of services..."
                label="Business description"
                autosize
                minRows={3}
                maxRows={3}
                {...applicationForm.getInputProps("businessDescription")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Text fz="0.875rem" color="#212529" fw={500}>
                Business address
              </Text>
              <AddressSidewaysScrollThing
                addressList={applicationForm.values.businessAddresses}
                openModal={open}
                onRemoveAddress={handleRemoveAddress}
                isDisabled={isDisabled}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Dropzone
                disabled={isDisabled}
                styles={{ inner: { pointerEvents: "all" } }}
                accept={PDF_MIME_TYPE}
                onDrop={(files) => {
                  applicationForm.setValues({
                    ...applicationForm.values,
                    attachments: files,
                  });
                }}
              >
                {isDisabled ? (
                  <Text align="center">Licenses and permits</Text>
                ) : (
                  <Text align="center">
                    Attach licenses and permits (if any)
                  </Text>
                )}
                <SimpleGrid
                  cols={4}
                  breakpoints={[{ maxWidth: "xs", cols: 1 }]}
                  mt={previews.length > 0 ? "xl" : 0}
                >
                  {previews}
                </SimpleGrid>
              </Dropzone>
            </Grid.Col>
            <Grid.Col span={12}>
              <Button
                type="submit"
                fullWidth
                leftIcon={<IconSend size="1rem" />}
                uppercase
                disabled={isDisabled}
              >
                {applicationStatus === BusinessApplicationStatusEnum.Rejected
                  ? "Update Application"
                  : "Submit Application"}
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      )}
      <AddAddressModal
        opened={isAddAddressModalOpened}
        open={open}
        close={close}
        addAddressForm={addressForm}
        handleAddAddress={handleAddAddress}
      />
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return null;

  const userId = session.user["userId"];
  const accountType = session.user["accountType"];

  return { props: { userId, accountType } };
}
