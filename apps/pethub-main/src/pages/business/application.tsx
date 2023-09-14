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
} from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconSend, IconUpload, IconAlertCircle } from "@tabler/icons-react";
import React from "react";
import { PageTitle } from "web-ui";
import FileMiniIcon from "@/components/common/file/FileMiniIcon";
import { PDFPreview } from "@/components/common/file/PDFPreview";
import { AddAddressModal } from "@/components/pbapplication/AddAddressModal";
import { AddressSidewaysScrollThing } from "@/components/pbapplication/AddressSidewaysScrollThing";
import ApplicationStatusBadge from "@/components/pbapplication/ApplicationStatusAlert";
import ApplicationStatusAlert from "@/components/pbapplication/ApplicationStatusAlert";
import {
  BusinessApplicationStatusEnum,
  PetBusinessTypeEnum,
} from "@/types/constants";
import { Address } from "@/types/types";
import { validateAddressName } from "@/util";

export default function Application() {
  const [isAddAddressModalOpened, { open, close }] = useDisclosure(false);

  // temporary hardcode
  const applicationStatus = BusinessApplicationStatusEnum.Pending;

  const businessTypeData = Object.entries(PetBusinessTypeEnum).map(
    ([key, value]) => ({
      value: key.toLowerCase(),
      label: value as string,
    }),
  );

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
      websiteURL: (value) =>
        !/^(http|https):\/\/[^ "]+$/.test(value) || !value
          ? "Invalid or missing website URL. Website must start with http:// or https://"
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

  type applicationFormValues = typeof applicationForm.values;
  function handleSubmit(values: applicationFormValues) {
    console.log("Submitting", values);
  }

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
    The below 2 functions are for PDF file handling in the attachment dropzone
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

  return (
    <Container mt="50px" mb="xl">
      <ApplicationStatusAlert applicationStatus={applicationStatus} />{" "}
      {/*Render this only when there is an attached PB application to the PB*/}
      <Group position="left">
        <PageTitle title="Pet Business Application" />
      </Group>
      <Text size="sm" color="dimmed">
        Apply to be a Pet Business Partner with us today!
      </Text>
      <form
        onSubmit={applicationForm.onSubmit((values: any) =>
          handleSubmit(values),
        )}
      >
        <Grid mt="sm" mb="sm" gutter="lg">
          <Grid.Col span={12}>
            <Select
              withAsterisk
              data={businessTypeData}
              label="Business type"
              placeholder="Select a business type"
              {...applicationForm.getInputProps("businessType")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              withAsterisk
              label="Business email"
              placeholder="example@email.com"
              {...applicationForm.getInputProps("businessEmail")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              withAsterisk
              placeholder="https://www.igroomdoggos.com"
              label="Business website URL"
              {...applicationForm.getInputProps("websiteURL")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
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
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Dropzone
              styles={{ inner: { pointerEvents: "all" } }}
              accept={PDF_MIME_TYPE}
              onDrop={(files) => {
                applicationForm.setValues({
                  ...applicationForm.values,
                  attachments: files,
                });
              }}
            >
              <Text align="center">Drop licenses and permits (if any)</Text>
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
            >
              Submit Application
            </Button>
          </Grid.Col>
        </Grid>
      </form>
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
