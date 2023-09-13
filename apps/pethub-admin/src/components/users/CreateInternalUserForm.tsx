import {
  Button,
  TextInput,
  Group,
  Container,
  createStyles,
  Grid,
  PasswordInput,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconX } from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";
import { IconUserCog } from "@tabler/icons-react";
import React, { useState } from "react";
import { PageTitle } from "web-ui";
import PasswordBar from "web-ui/shared/PasswordBar";
import { useCreateInternalUser } from "@/hooks/internal-user";
import { AccountTypeEnum, InternalUserRoleEnum } from "@/types/constants";
import { CreateInternalUserPayload } from "@/types/types";
import { validatePassword } from "@/util";

export function CreateInternalUserForm({
  onUserCreated,
}: {
  onUserCreated: (success: boolean) => void;
}) {
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
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      accountType: AccountTypeEnum.InternalUser,
      firstName: "",
      lastName: "",
      adminRole: InternalUserRoleEnum.admin,
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      firstName: (value, values) =>
        values.accountType === AccountTypeEnum.InternalUser && !value
          ? "First name is required."
          : null,
      lastName: (value, values) =>
        values.accountType === AccountTypeEnum.InternalUser && !value
          ? "Last name is required."
          : null,
      email: isEmail("Invalid email."),
      password: validatePassword,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match." : null,
    },
  });

  type FormValues = typeof form.values;

  const createInternalUserMutation = useCreateInternalUser();
  const createInternalUserAccount = async (
    payload: CreateInternalUserPayload,
  ) => {
    try {
      await createInternalUserMutation.mutateAsync(payload);
      notifications.show({
        title: "Account Created",
        color: "green",
        icon: <IconCheck />,
        message: `Internal User created successfully!`,
      });

      onUserCreated(true);
    } catch (error: any) {
      onUserCreated(false);
      notifications.show({
        title: "Error Creating Account",
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

  function handleSubmit(values: FormValues) {
    const payload: CreateInternalUserPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      adminRole: values.adminRole,
      password: values.password,
    };
    createInternalUserAccount(payload);
  }

  return (
    <>
      <Container className={classes.whiteBackground} p="50px">
        <Group>
          <IconUserCog size="2rem" />
          <PageTitle title="Create Internal User" />
        </Group>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Grid mt="md" mb="md">
            <Grid.Col span={12}>
              <TextInput
                label="First name"
                placeholder="First name"
                {...form.getInputProps("firstName")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Last name"
                placeholder="Last name"
                {...form.getInputProps("lastName")}
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
            Create Internal User
          </Button>
        </form>
      </Container>
    </>
  );
}
