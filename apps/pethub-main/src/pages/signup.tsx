import {
  Box,
  Button,
  Container,
  Grid,
  PasswordInput,
  SegmentedControl,
  TextInput,
  Center,
} from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";
import {
  IconBuildingStore,
  IconPawFilled,
  IconPlus,
} from "@tabler/icons-react";
import React from "react";
import { PageTitle } from "web-ui";

export default function SignUp() {
  const form = useForm({
    initialValues: {
      accountType: "PET_OWNER",
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },

    validate: {
      companyName: (value, values) =>
        values.accountType === "PET_BUSINESS" && !value
          ? "Company name is required."
          : null,
      firstName: (value, values) =>
        values.accountType === "PET_OWNER" && !value
          ? "First name is required."
          : null,
      lastName: (value, values) =>
        values.accountType === "PET_OWNER" && !value
          ? "Last name is required."
          : null,
      email: isEmail("Invalid email."),
      password: hasLength(
        { min: 8 },
        "Password must be at least 8 characters long.",
      ),
    },
  });

  const segmentedControlData = [
    {
      value: "PET_OWNER",
      label: (
        <Center>
          <IconPawFilled size="1rem" />
          <Box ml={10}>Pet Owner</Box>
        </Center>
      ),
    },
    {
      value: "PET_BUSINESS",
      label: (
        <Center>
          <IconBuildingStore size="1rem" />
          <Box ml={10}>Pet Business</Box>
        </Center>
      ),
    },
  ];

  const nameFields =
    form.values.accountType === "PET_OWNER" ? (
      <>
        <Grid.Col span={6}>
          <TextInput
            label="First name"
            placeholder="First name"
            withAsterisk
            {...form.getInputProps("firstName")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Last name"
            placeholder="Last name"
            withAsterisk
            {...form.getInputProps("lastName")}
          />
        </Grid.Col>
      </>
    ) : (
      <Grid.Col span={12}>
        <TextInput
          label="Company name"
          placeholder="Company name"
          withAsterisk
          {...form.getInputProps("companyName")}
        />
      </Grid.Col>
    );

  return (
    <Container>
      <Box mt="lg">
        <PageTitle title="🐕 Join the PetHub community" />
        <form onSubmit={form.onSubmit(console.log)}>
          <Grid mt="md" mb="md">
            <Grid.Col span={12}>
              <SegmentedControl
                color="dark"
                fullWidth
                size="md"
                data={segmentedControlData}
                {...form.getInputProps("accountType")}
              />
            </Grid.Col>
            {nameFields}
            <Grid.Col span={12}>
              <TextInput
                label="Email"
                placeholder="email@email.com"
                withAsterisk
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <PasswordInput
                placeholder="Password"
                label="Password"
                withAsterisk
                {...form.getInputProps("password")}
              />
            </Grid.Col>
          </Grid>
          <Button type="submit" fullWidth leftIcon={<IconPlus size="1rem" />}>
            Create account
          </Button>
        </form>
      </Box>
    </Container>
  );
}
