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
import { DateInput } from "@mantine/dates";
import { useForm, isEmail, hasLength, isNotEmpty } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconBuildingStore,
  IconCalendar,
  IconCheck,
  IconPawFilled,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { PageTitle } from "web-ui";
import PasswordBar from "web-ui/shared/PasswordBar";
import { usePetBusinessCreate } from "@/hooks/pet-business";
import { usePetOwnerCreate } from "@/hooks/pet-owner";
import { CreatePetBusinessRequest, CreatePetOwnerRequest } from "@/types/types";

export default function SignUp() {
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: {
      userType: "petOwner",
      companyName: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      contactNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      companyName: (value, values) =>
        values.userType === "petBusiness" && !value
          ? "Company name is required."
          : null,
      firstName: (value, values) =>
        values.userType === "petOwner" && !value
          ? "First name is required."
          : null,
      lastName: (value, values) =>
        values.userType === "petOwner" && !value
          ? "Last name is required."
          : null,
      contactNumber: hasLength(
        { min: 8, max: 8 },
        "Phone number must be 8 digits long.",
      ),
      email: isEmail("Invalid email."),
      dateOfBirth: isNotEmpty("Date of birth required."),
      password: (value) =>
        /^(?!.* )(?=.*\d)(?=.*[a-z]).{8,}$/.test(value)
          ? null
          : "Password must be at least 8 characters long with at least 1 letter, 1 number and no white spaces.",
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match." : null,
    },
  });

  const createPetOwnerMutation = usePetOwnerCreate(queryClient);
  const createPetOwnerAccount = async (payload: CreatePetOwnerRequest) => {
    try {
      await createPetOwnerMutation.mutateAsync(payload);
      notifications.show({
        title: "Account Created",
        color: "green",
        icon: <IconCheck />,
        message: `Pet owner account created successfully!`,
      });
      // TODO login and redirect home page
    } catch (error: any) {
      notifications.show({
        title: "Error Creating Account",
        color: "red",
        icon: <IconX />,
        message: error.response.data.message,
      });
    }
  };

  const createPetBusinessMutation = usePetBusinessCreate(queryClient);
  const createPetBusinessAccount = async (
    payload: CreatePetBusinessRequest,
  ) => {
    try {
      await createPetBusinessMutation.mutateAsync(payload);
      notifications.show({
        title: "Account Created",
        color: "green",
        icon: <IconCheck />,
        message: `Pet business account created successfully!`,
      });
      // TODO login and redirect to pet business dashboard
    } catch (error: any) {
      notifications.show({
        title: "Error Creating Account",
        color: "red",
        icon: <IconX />,
        message: error.response.data.message,
      });
    }
  };

  function handleSubmit(values: any) {
    if (values.userType === "petOwner") {
      const payload: CreatePetOwnerRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        contactNumber: values.contactNumber,
        dateOfBirth: new Date(values.dateOfBirth).toISOString(),
        user: {
          create: {
            email: values.email,
            password: values.password,
          },
        },
      };
      createPetOwnerAccount(payload);
    } else {
      // userType === "petBusiness"
      const payload: CreatePetBusinessRequest = {
        companyName: values.companyName,
        contactNumber: values.contactNumber,
        user: {
          create: {
            email: values.email,
            password: values.password,
          },
        },
      };
      createPetBusinessAccount(payload);
    }
    form.reset();
  }

  const segmentedControlData = [
    {
      value: "petOwner",
      label: (
        <Center>
          <IconPawFilled size="1rem" />
          <Box ml={10}>Pet Owner</Box>
        </Center>
      ),
    },
    {
      value: "petBusiness",
      label: (
        <Center>
          <IconBuildingStore size="1rem" />
          <Box ml={10}>Pet Business</Box>
        </Center>
      ),
    },
  ];

  const conditionalFields =
    form.values.userType === "petOwner" ? (
      // pet owner fields
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
        <Grid.Col span={12}>
          <DateInput
            label="Date of birth"
            placeholder="Date of birth"
            valueFormat="DD/MM/YYYY"
            maxDate={new Date()}
            icon={<IconCalendar size="1rem" />}
            withAsterisk
            {...form.getInputProps("dateOfBirth")}
          />
        </Grid.Col>
      </>
    ) : (
      // pet business fields
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
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Grid mt="md" mb="md">
            <Grid.Col span={12}>
              <SegmentedControl
                color="dark"
                fullWidth
                size="md"
                data={segmentedControlData}
                {...form.getInputProps("userType")}
              />
            </Grid.Col>
            {conditionalFields}
            <Grid.Col span={12}>
              <TextInput
                label="Contact number"
                placeholder="Contact number"
                withAsterisk
                {...form.getInputProps("contactNumber")}
              />
            </Grid.Col>
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
            <Grid.Col span={12}>
              <PasswordBar password={form.values.password} />
            </Grid.Col>
            <Grid.Col span={12}>
              <PasswordInput
                placeholder="Confirm password"
                label="Confirm password"
                withAsterisk
                {...form.getInputProps("confirmPassword")}
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
