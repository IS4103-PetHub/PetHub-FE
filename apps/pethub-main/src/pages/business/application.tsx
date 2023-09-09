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
  Avatar,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconSend, IconUpload } from "@tabler/icons-react";
import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import { PageTitle } from "web-ui";
import { AddAddressModal } from "@/components/pbapplication/AddAddressModal";
import { AddressSidewaysScrollThing } from "@/components/pbapplication/AddressSidewaysScrollThing";
import { PetBusinessTypeEnum } from "@/types/constants";

export default function Application() {
  const [isAddAddressModalOpened, { open, close }] = useDisclosure(false);
  const [avatarURL, setAvatarURL] = useState(null);

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
      attachments: null,
    },

    validate: {
      businessIcon: (value) => null,
      businessType: (value) =>
        value.length === 0 ? "Business type is required." : null,
      businessEmail: (value) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
          ? null
          : "Invalid or missing email.",
      businessAddresses: (value) =>
        value.length === 0
          ? "At least one business address is required."
          : null,
      websiteURL: (value) =>
        !/^(http|https):\/\/[^ "]+$/.test(value) || !value
          ? "Invalid or missing website URL."
          : null,
      attachments: (value) => null,
    },
  });

  const addressForm = useForm({
    initialValues: {
      addressName: "",
      addressLine1: "",
      addressLine2: "",
      addressPostalCode: "",
    },
    validate: {
      addressName: (value) => (!value ? "Address name is required." : null),
      addressLine1: (value) => (!value ? "Address is required." : null),
      addressPostalCode: (value) =>
        !value ? "Address postal code is required." : null,
    },
  });

  type applicationFormValues = typeof applicationForm.values;
  function handleSubmit(values: applicationFormValues) {
    console.log("Submitting", values);
  }

  type addressFormValues = typeof addressForm.values;
  function handleAddAddress(values: addressFormValues) {
    console.log("address values", values);
    const updatedAddresses = [
      ...applicationForm.values.businessAddresses,
      values,
    ];
    applicationForm.setValues({
      ...applicationForm.values,
      businessAddresses: updatedAddresses,
    });
    console.log("Address array", applicationForm.values.businessAddresses);
    close();
    addressForm.reset();
  }

  const handleFileChange = (file: File) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarURL(imageUrl);
      applicationForm.setValues({
        ...applicationForm.values,
        businessIcon: file,
      });
    }
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
        <Grid mt="sm" mb="sm" gutter="xs">
          <Grid.Col span={10}>
            <FileInput
              label="Business Profile Image"
              placeholder="Upload an icon here"
              icon={<IconUpload size="1rem" />}
              {...applicationForm.getInputProps("businessIcon")}
              onChange={handleFileChange}
            />
            {avatarURL && (
              <Avatar
                src={avatarURL}
                size={100}
                style={{ marginTop: "20px" }}
              />
            )}
          </Grid.Col>
          <Grid.Col span={10}>
            <MultiSelect
              withAsterisk
              data={businessTypeData}
              label="Business Type"
              placeholder="Select all the business types that apply"
              {...applicationForm.getInputProps("businessType")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <TextInput
              withAsterisk
              label="Business Email"
              placeholder="example@email.com"
              {...applicationForm.getInputProps("businessEmail")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <TextInput
              withAsterisk
              placeholder="https://www.igroomdoggos.com"
              label="Business Website URL"
              {...applicationForm.getInputProps("websiteURL")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <Textarea
              placeholder="Description of services..."
              label="Business Description"
              autosize
              minRows={3}
              maxRows={3}
              {...applicationForm.getInputProps("businessDescription")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <Text>Business Address (min 1)</Text>
            <FileInput
              label="Attachments"
              placeholder="Any licenses and permits"
              icon={<IconUpload size="1rem" />}
              multiple
              {...applicationForm.getInputProps("attachments")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <AddressSidewaysScrollThing
              addressList={applicationForm.values.businessAddresses}
              openModal={open}
            />
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
