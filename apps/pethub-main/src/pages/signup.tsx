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
import { useForm, isEmail } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconBuildingStore,
  IconCalendar,
  IconCheck,
  IconDog,
  IconPawFilled,
  IconPlus,
} from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { getErrorMessageProps, validatePassword } from "shared-utils";
import { AccountTypeEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import { useLoadingOverlay } from "web-ui/shared/LoadingOverlayContext";
import PasswordBar from "web-ui/shared/PasswordBar";
import { useCreatePetBusiness } from "@/hooks/pet-business";
import { useCreatePetOwner } from "@/hooks/pet-owner";
import { CreatePetBusinessPayload, CreatePetOwnerPayload } from "@/types/types";

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
  const router = useRouter();
  const { showOverlay, hideOverlay } = useLoadingOverlay();

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
      contactNumber: (value) =>
        /^[0-9]{8}$/.test(value)
          ? null
          : "Contact number must be 8 digits long.",
      email: isEmail("Invalid email."),
      dateOfBirth: (value, values) =>
        values.accountType === AccountTypeEnum.PetOwner && !value
          ? "Date of birth required."
          : null,
      password: validatePassword,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match." : null,
    },
  });

  type FormValues = typeof form.values;

  const handleRouteToVerfiyEmail = async (email) => {
    router.push(`/verify-email?email=${email}`);
  };

  const createPetOwnerMutation = useCreatePetOwner();
  const createPetOwnerAccount = async (payload: CreatePetOwnerPayload) => {
    try {
      await createPetOwnerMutation.mutateAsync(payload);
      notifications.show({
        title: "Account Created",
        color: "green",
        icon: <IconCheck />,
        message: `Pet owner account created successfully!`,
      });
      // login and redirect to verify email
      handleRouteToVerfiyEmail(payload.email);
    } catch (error: any) {
      hideOverlay();
      notifications.show({
        ...getErrorMessageProps("Error Creating Account", error),
      });
    }
    hideOverlay();
  };

  const createPetBusinessMutation = useCreatePetBusiness();
  const createPetBusinessAccount = async (
    payload: CreatePetBusinessPayload,
  ) => {
    try {
      await createPetBusinessMutation.mutateAsync(payload);
      notifications.show({
        title: "Account Created",
        color: "green",
        icon: <IconCheck />,
        message: `Pet business account created successfully!`,
      });
      // login and redirect to verify email
      handleRouteToVerfiyEmail(payload.email);
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Creating Account", error),
      });
    }
    hideOverlay();
  };

  function handleSubmit(values: FormValues) {
    showOverlay();
    if (values.accountType === AccountTypeEnum.PetOwner) {
      const payload: CreatePetOwnerPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        contactNumber: values.contactNumber,
        dateOfBirth: new Date(values.dateOfBirth).toISOString(),
        email: values.email,
        password: values.password,
      };
      createPetOwnerAccount(payload);
    } else {
      // if accountType === "petBusiness"
      const payload: CreatePetBusinessPayload = {
        companyName: values.companyName,
        uen: values.uen,
        contactNumber: values.contactNumber,
        email: values.email,
        password: values.password,
      };
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
            valueFormat="DD-MM-YYYY"
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
    <>
      <Head>
        <title>Sign Up - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
            <Button
              type="submit"
              size="md"
              fullWidth
              leftIcon={<IconPlus size="1rem" />}
              color="dark"
              className="gradient-hover"
            >
              Create account
            </Button>
          </form>
        </Container>
      </BackgroundImage>
    </>
  );
}
