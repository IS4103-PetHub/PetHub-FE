import {
  MultiSelect,
  Button,
  Container,
  Grid,
  Textarea,
  TextInput,
  Group,
  FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconSend, IconUpload } from "@tabler/icons-react";
import React from "react";
import { PageTitle } from "web-ui";
import { AddressSidewaysScrollThing } from "@/components/pbapplication/AddressSidewaysScrollThing";
import { PetBusinessTypeEnum } from "@/types/constants";

export default function Application() {
  const businessTypeData = Object.entries(PetBusinessTypeEnum).map(
    ([key, value]) => ({
      value: key.toLowerCase(),
      label: value as string,
    }),
  );

  const form = useForm({
    initialValues: {
      businessType: [],
      businessAddresses: [],
      businessEmail: "",
      websiteURL: "",
      businessDescription: "",
      attachments: "",
    },

    validate: {
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

  function handleSubmit(values: any) {
    console.log("Submitting", values);
  }

  const mockAddresses = [
    {
      name: "Vivo City",
      line1: "1 Vivo Lane",
      line2: "Complex A",
      postal: "SG12864",
      isDefault: true,
    },
    {
      name: "Esplanade",
      line1: "2 Durian Lane",
      line2: "Spiky Road #03-40",
      postal: "S2938642",
      isDefault: false,
    },
    {
      name: "John Building",
      line1: "1 John Road",
      line2: "John Complex",
      postal: "SG283764",
      isDefault: false,
    },
    {
      name: "Groomer HQ",
      line1: "Groomer Road 45",
      line2: "",
      postal: "SG293875",
      isDefault: false,
    },
    {
      name: "address 5",
      line1: "address line 1",
      line2: "address line 2",
      postal: "9186348913",
      isDefault: false,
    },
  ];

  return (
    <Container p="lg">
      <Group>
        <PageTitle title="Business Partner Application" />
      </Group>

      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Grid mt="sm" mb="sm" gutter="xs">
          <Grid.Col span={10}>
            <MultiSelect
              withAsterisk
              data={businessTypeData}
              label="Business Type"
              placeholder="Select all the business types that apply"
              {...form.getInputProps("businessType")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <TextInput
              withAsterisk
              label="Business Email"
              placeholder="example@email.com"
              {...form.getInputProps("businessEmail")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <TextInput
              withAsterisk
              placeholder="https://www.igroomdoggos.com"
              label="Business Website URL"
              {...form.getInputProps("websiteURL")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <Textarea
              placeholder="Description of services..."
              label="Business Description"
              autosize
              minRows={3}
              maxRows={3}
              {...form.getInputProps("businessDescription")}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <FileInput
              label="Attachments"
              placeholder="Any licenses and permits"
              icon={<IconUpload size="1rem" />}
              multiple
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <AddressSidewaysScrollThing addressList={mockAddresses} />
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
    </Container>
  );
}
