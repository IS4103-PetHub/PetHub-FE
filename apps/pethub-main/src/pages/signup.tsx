import {
  Box,
  Button,
  Container,
  Grid,
  PasswordInput,
  SegmentedControl,
  TextInput,
  Center,
  BackgroundImage,
  Group,
  createStyles,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, isEmail, hasLength, isNotEmpty } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconBuildingStore,
  IconCalendar,
  IconCheck,
  IconDog,
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
import { AccountTypeEnum } from "@/types/constants";
import { CreatePetBusinessRequest, CreatePetOwnerRequest } from "@/types/types";

const useStyles = createStyles((theme) => ({
  backgroundEffect: {
    height: "100%",
    background:
      "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
  },

  whiteBackground: {
    height: "100%",
    backgroundColor: "white",
  },
}));

export default function SignUp() {
  const { classes } = useStyles();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      accountType: AccountTypeEnum.PetOwner,
      companyName: "",
      uen: "",
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
        values.accountType === AccountTypeEnum.PetBusiness && !value
          ? "Company name is required."
          : null,
      uen: (value, values) =>
        values.accountType === AccountTypeEnum.PetBusiness &&
        !/^.{8,9}[A-Z]$/.test(value)
          ? "Invalid Unique Entity Number (UEN)."
          : null,
      firstName: (value, values) =>
        values.accountType === AccountTypeEnum.PetOwner && !value
          ? "First name is required."
          : null,
      lastName: (value, values) =>
        values.accountType === AccountTypeEnum.PetOwner && !value
          ? "Last name is required."
          : null,
      contactNumber: hasLength(
        { min: 8, max: 8 },
        "Contact number must be 8 digits long.",
      ),
      email: isEmail("Invalid email."),
      dateOfBirth: (value, values) =>
        values.accountType === AccountTypeEnum.PetOwner && !value
          ? "Date of birth required."
          : null,
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
      form.reset();
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
      form.reset();
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
    if (values.accountType === AccountTypeEnum.PetOwner) {
      const payload: CreatePetOwnerRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        contactNumber: values.contactNumber,
        dateOfBirth: new Date(values.dateOfBirth).toISOString(),
        email: values.email,
        password: values.password,
      };
      console.log(payload);
      createPetOwnerAccount(payload);
    } else {
      // if accountType === "petBusiness"
      const payload: CreatePetBusinessRequest = {
        companyName: values.companyName,
        uen: values.uen,
        contactNumber: values.contactNumber,
        email: values.email,
        password: values.password,
      };
      console.log(payload);
      createPetBusinessAccount(payload);
    }
  }

  const segmentedControlData = [
    {
      value: AccountTypeEnum.PetOwner,
      label: (
        <Center>
          <IconPawFilled size="1rem" />
          <Box ml={10}>Pet Owner</Box>
        </Center>
      ),
    },
    {
      value: AccountTypeEnum.PetBusiness,
      label: (
        <Center>
          <IconBuildingStore size="1rem" />
          <Box ml={10}>Pet Business</Box>
        </Center>
      ),
    },
  ];

  const conditionalFields =
    form.values.accountType === AccountTypeEnum.PetOwner ? (
      // pet owner fields
      <>
        <Grid.Col span={6}>
          <TextInput
            label="First name"
            placeholder="First name"
            {...form.getInputProps("firstName")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Last name"
            placeholder="Last name"
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
            {...form.getInputProps("dateOfBirth")}
          />
        </Grid.Col>
      </>
    ) : (
      // pet business fields
      <>
        <Grid.Col span={12}>
          <TextInput
            label="Company name"
            placeholder="Company name"
            {...form.getInputProps("companyName")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Unique Entity Number (UEN)"
            placeholder="UEN"
            {...form.getInputProps("uen")}
          />
        </Grid.Col>
      </>
    );

  return (
    <BackgroundImage src="" className={classes.backgroundEffect}>
      <Container className={classes.whiteBackground} p="50px">
        <Group>
          <IconDog size="2rem" />
          <PageTitle title="Join the PetHub community" />
        </Group>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
            {conditionalFields}
            <Grid.Col span={12}>
              <TextInput
                label="Contact number"
                placeholder="Contact number"
                {...form.getInputProps("contactNumber")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Email"
                placeholder="email@email.com"
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <PasswordInput
                placeholder="Password"
                label="Password"
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
                {...form.getInputProps("confirmPassword")}
              />
            </Grid.Col>
          </Grid>
          <Button type="submit" fullWidth leftIcon={<IconPlus size="1rem" />}>
            Create account
          </Button>
        </form>
      </Container>
    </BackgroundImage>
  );
}
