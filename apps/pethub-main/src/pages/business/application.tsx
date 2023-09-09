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
} from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconSend, IconUpload } from "@tabler/icons-react";
import React from "react";
import { PageTitle } from "web-ui";
import FileMiniIcon from "@/components/common/file/FileMiniIcon";
import { PDFPreview } from "@/components/common/file/PDFPreview";
import { AddAddressModal } from "@/components/pbapplication/AddAddressModal";
import { AddressSidewaysScrollThing } from "@/components/pbapplication/AddressSidewaysScrollThing";
import { PetBusinessTypeEnum } from "@/types/constants";
import { Address } from "@/types/types";

export default function Application() {
  const [isAddAddressModalOpened, { open, close }] = useDisclosure(false);

  const businessTypeData = Object.entries(PetBusinessTypeEnum).map(
    ([key, value]) => ({
      value: key.toLowerCase(),
      label: value as string,
    }),
  );

  const applicationForm = useForm({
    initialValues: {
      businessIcon: null,
      businessType: [],
      businessAddresses: [],
      businessEmail: "",
      websiteURL: "",
      businessDescription: "",
      attachments: [],
    },

    validate: {
      businessIcon: (value) => null,
      businessType: (value) =>
        value.length === 0 ? "Business type is required." : null,
      businessEmail: (value) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
          ? null
          : "Invalid or missing email.",
      businessAddresses: (value) => null,
      websiteURL: (value) =>
        !/^(http|https):\/\/[^ "]+$/.test(value) || !value
          ? "Invalid or missing website URL."
          : null,
      attachments: (value) => null,
    },
  });

  const addressForm = useForm({
    initialValues: {
      name: "",
      line1: "",
      line2: "",
      postal: "",
      isDefault: false,
    },
    validate: {
      name: (value) => (!value ? "Address name is required." : null),
      line1: (value) => (!value ? "Address is required." : null),
      postal: (value) => (!value ? "Address postal code is required." : null),
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
    // Check if this is the first address being added, if yes set it to default
    if (applicationForm.values.businessAddresses.length === 0) {
      values.isDefault = true;
    }

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

  function handleSetDefaultAddress(address: Address) {
    // Reset the default values of all other addresses to false except the chosen one
    const updatedAddresses = applicationForm.values.businessAddresses.map(
      (a) => {
        if (a === address) {
          return {
            ...a,
            isDefault: true,
          };
        } else {
          return {
            ...a,
            isDefault: false,
          };
        }
      },
    );
    applicationForm.setValues({
      ...applicationForm.values,
      businessAddresses: updatedAddresses,
    });
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
    <Container p="lg">
      <Group>
        <PageTitle title="Business Partner Application" />
      </Group>

      <form
        onSubmit={applicationForm.onSubmit((values: any) =>
          handleSubmit(values),
        )}
      >
        <Grid mt="sm" mb="sm" gutter="lg">
          <Grid.Col span={10}>
            <FileInput
              valueComponent={FileMiniIcon}
              accept="image/png,image/jpeg"
              label="Business profile image"
              placeholder="Upload an icon here"
              icon={<IconUpload size="1rem" />}
              {...applicationForm.getInputProps("businessIcon")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <MultiSelect
              withAsterisk
              data={businessTypeData}
              label="Business type"
              placeholder="Select all the business types that apply"
              {...applicationForm.getInputProps("businessType")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <TextInput
              withAsterisk
              label="Business email"
              placeholder="example@email.com"
              {...applicationForm.getInputProps("businessEmail")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <TextInput
              withAsterisk
              placeholder="https://www.igroomdoggos.com"
              label="Business website URL"
              {...applicationForm.getInputProps("websiteURL")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <Textarea
              placeholder="Description of services..."
              label="Business description"
              autosize
              minRows={3}
              maxRows={3}
              {...applicationForm.getInputProps("businessDescription")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <Text fz="0.875rem" color="#212529" fw={500}>
              Business address
            </Text>
            <AddressSidewaysScrollThing
              addressList={applicationForm.values.businessAddresses}
              openModal={open}
              onRemoveAddress={handleRemoveAddress}
              onSetDefaultAddress={handleSetDefaultAddress}
            />
          </Grid.Col>
          <Grid.Col span={10}>
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
          <Grid.Col span={10}>
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
