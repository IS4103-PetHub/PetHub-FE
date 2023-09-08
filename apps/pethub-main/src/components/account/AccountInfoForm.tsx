import { Button, Divider, Grid, Group, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isEmail, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { IconCalendar, IconPencil } from "@tabler/icons-react";
import React from "react";
import { PetBusinessAccount, PetOwnerAccount } from "@/types/types";
import { formatISODateString } from "@/util";

interface AccountInfoFormProps {
  petOwner?: PetOwnerAccount;
  petBusiness?: PetBusinessAccount;
}

const AccountInfoForm = ({ petOwner, petBusiness }: AccountInfoFormProps) => {
  const [isEditing, setIsEditing] = useToggle();

  const form = useForm({
    initialValues: {
      companyName: petBusiness ? petBusiness.companyName : "",
      uen: petBusiness ? petBusiness.uen : "",
      firstName: petOwner ? petOwner.firstName : "",
      lastName: petOwner ? petOwner.lastName : "",
      dateOfBirth: petOwner ? new Date(petOwner.dateOfBirth) : "",
      contactNumber: petOwner
        ? petOwner.contactNumber
        : petBusiness.contactNumber,
      email: petOwner ? petOwner.email : petBusiness.email,
    },

    validate: {
      companyName: (value, values) =>
        petBusiness && !value ? "Company name is required." : null,
      uen: (value, values) =>
        petBusiness && !/^.{8,9}[A-Z]$/.test(value)
          ? "Invalid Unique Entity Number (UEN)."
          : null,
      firstName: (value, values) =>
        petOwner && !value ? "First name is required." : null,
      lastName: (value, values) =>
        petOwner && !value ? "Last name is required." : null,
      contactNumber: (value) =>
        /^[0-9]{8}$/.test(value)
          ? null
          : "Contact number must be 8 digits long.",
      email: isEmail("Invalid email."),
      dateOfBirth: (value, values) =>
        petOwner && !value ? "Date of birth required." : null,
    },
  });

  if (!petOwner && !petBusiness) {
    return null;
  }

  const KEY_SPAN = petOwner ? 3 : 4;
  const VALUE_SPAN = 12 - KEY_SPAN;

  type FormValues = typeof form.values;
  const handleSubmit = (values: FormValues) => {
    console.log(values);
    setIsEditing(false);
  };

  const conditionalFields = petOwner ? (
    // pet owner fields
    <>
      <Grid.Col span={KEY_SPAN}>
        <strong>First name</strong>
      </Grid.Col>
      <Grid.Col span={VALUE_SPAN}>
        {isEditing ? (
          <TextInput
            placeholder="First name"
            {...form.getInputProps("firstName")}
          />
        ) : (
          petOwner.firstName
        )}
      </Grid.Col>
      <Grid.Col span={12}>
        <Divider my="sm" />
      </Grid.Col>

      <Grid.Col span={KEY_SPAN}>
        <strong>Last name</strong>
      </Grid.Col>
      <Grid.Col span={VALUE_SPAN}>
        {isEditing ? (
          <TextInput
            placeholder="Last name"
            {...form.getInputProps("lastName")}
          />
        ) : (
          petOwner.lastName
        )}
      </Grid.Col>
      <Grid.Col span={12}>
        <Divider my="sm" />
      </Grid.Col>

      <Grid.Col span={KEY_SPAN}>
        <strong>Date of birth</strong>
      </Grid.Col>
      <Grid.Col span={VALUE_SPAN}>
        {isEditing ? (
          <DateInput
            placeholder="Date of birth"
            valueFormat="DD/MM/YYYY"
            maxDate={new Date()}
            icon={<IconCalendar size="1rem" />}
            {...form.getInputProps("dateOfBirth")}
          />
        ) : (
          formatISODateString(petOwner.dateOfBirth)
        )}
      </Grid.Col>
      <Grid.Col span={12}>
        <Divider my="sm" />
      </Grid.Col>
    </>
  ) : (
    // pet business fields
    <>
      <Grid.Col span={KEY_SPAN}>
        <strong>Company name</strong>
      </Grid.Col>
      <Grid.Col span={VALUE_SPAN}>
        {isEditing ? (
          <TextInput
            placeholder="companyName"
            {...form.getInputProps("companyName")}
          />
        ) : (
          petBusiness.companyName
        )}
      </Grid.Col>
      <Grid.Col span={12}>
        <Divider my="sm" />
      </Grid.Col>

      <Grid.Col span={KEY_SPAN}>
        <strong>Unique Entity Number (UEN)</strong>
      </Grid.Col>
      <Grid.Col span={VALUE_SPAN}>
        {isEditing ? (
          <TextInput
            placeholder="Unique Entity Number (UEN)"
            {...form.getInputProps("uen")}
          />
        ) : (
          petBusiness.uen
        )}
      </Grid.Col>
      <Grid.Col span={12}>
        <Divider my="sm" />
      </Grid.Col>
    </>
  );

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Grid>
        {conditionalFields}

        <Grid.Col span={KEY_SPAN}>
          <strong>Contact Number</strong>
        </Grid.Col>
        <Grid.Col span={VALUE_SPAN}>
          {isEditing ? (
            <TextInput
              placeholder="Contact number"
              {...form.getInputProps("contactNumber")}
            />
          ) : petOwner ? (
            petOwner.contactNumber
          ) : (
            petBusiness.contactNumber
          )}
        </Grid.Col>
        <Grid.Col span={12}>
          <Divider my="sm" />
        </Grid.Col>

        <Grid.Col span={KEY_SPAN}>
          <strong>Email</strong>
        </Grid.Col>
        <Grid.Col span={VALUE_SPAN}>
          {isEditing ? (
            <TextInput placeholder="Email" {...form.getInputProps("email")} />
          ) : petOwner ? (
            petOwner.email
          ) : (
            petBusiness.email
          )}
        </Grid.Col>
      </Grid>

      <Group mt={25}>
        <Button
          type="reset"
          display={isEditing ? "block" : "none"}
          color="gray"
          onClick={() => {
            setIsEditing(false);
            form.reset();
          }}
        >
          Cancel
        </Button>
        <Button
          display={isEditing ? "none" : "block"}
          leftIcon={<IconPencil size="1rem" />}
          onClick={() => setIsEditing(true)}
        >
          Edit
        </Button>
        <Button type="submit" display={isEditing ? "block" : "none"}>
          Save
        </Button>
      </Group>
    </form>
  );
};

export default AccountInfoForm;