import { Button, Divider, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPencil } from "@tabler/icons-react";
import React from "react";
import { UserAccount } from "@/types/types";

interface PersonalInfoFormProps {
  user: UserAccount;
}

const PersonalInfoForm = ({ user }: PersonalInfoFormProps) => {
  const form = useForm({
    initialValues: {},
  });

  return (
    <>
      <Grid>
        <Grid.Col span={3}>
          <strong>First name</strong>
        </Grid.Col>
        <Grid.Col span={9}>{user.firstName}</Grid.Col>
        <Grid.Col span={12}>
          <Divider my="sm" />
        </Grid.Col>

        <Grid.Col span={3}>
          <strong>Last name</strong>
        </Grid.Col>
        <Grid.Col span={9}>{user.lastName}</Grid.Col>
        <Grid.Col span={12}>
          <Divider my="sm" />
        </Grid.Col>

        <Grid.Col span={3}>
          <strong>Date of birth</strong>
        </Grid.Col>
        <Grid.Col span={9}>{user.dateOfBirth}</Grid.Col>
        <Grid.Col span={12}>
          <Divider my="sm" />
        </Grid.Col>

        <Grid.Col span={3}>
          <strong>Contact number</strong>
        </Grid.Col>
        <Grid.Col span={9}>{user.contactNumber}</Grid.Col>
        <Grid.Col span={12}>
          <Divider my="sm" />
        </Grid.Col>

        <Grid.Col span={3}>
          <strong>Email</strong>
        </Grid.Col>
        <Grid.Col span={9}>{user.email}</Grid.Col>
      </Grid>
      <Button mt={25} leftIcon={<IconPencil size="1rem" />}>
        Edit
      </Button>
    </>
  );
};

export default PersonalInfoForm;
