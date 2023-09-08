import { Button, Divider, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import React from "react";
import { PetBusinessAccount, PetOwnerAccount } from "@/types/types";
import { formatISODateString } from "@/util";

interface AccountInfoFormProps {
  petOwner?: PetOwnerAccount;
  petBusiness?: PetBusinessAccount;
}

const AccountInfoForm = ({ petOwner, petBusiness }: AccountInfoFormProps) => {
  const [editing, setEditing] = useToggle();

  const form = useForm({
    initialValues: {},
  });

  if (!petOwner && !petBusiness) {
    return null;
  }

  const KEY_SPAN = petOwner ? 3 : 4;
  const VALUE_SPAN = 12 - KEY_SPAN;

  const conditionalFields = petOwner ? (
    // pet owner fields
    <>
      <Grid.Col span={KEY_SPAN}>
        <strong>First name</strong>
      </Grid.Col>
      <Grid.Col span={VALUE_SPAN}>{petOwner.firstName}</Grid.Col>
      <Grid.Col span={12}>
        <Divider my="sm" />
      </Grid.Col>

      <Grid.Col span={KEY_SPAN}>
        <strong>Last name</strong>
      </Grid.Col>
      <Grid.Col span={VALUE_SPAN}>{petOwner.lastName}</Grid.Col>
      <Grid.Col span={12}>
        <Divider my="sm" />
      </Grid.Col>

      <Grid.Col span={KEY_SPAN}>
        <strong>Date of birth</strong>
      </Grid.Col>
      <Grid.Col span={VALUE_SPAN}>
        {formatISODateString(petOwner.dateOfBirth)}
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
      <Grid.Col span={VALUE_SPAN}>{petBusiness.companyName}</Grid.Col>
      <Grid.Col span={12}>
        <Divider my="sm" />
      </Grid.Col>

      <Grid.Col span={KEY_SPAN}>
        <strong>Unique Entity Number (UEN)</strong>
      </Grid.Col>
      <Grid.Col span={VALUE_SPAN}>{petBusiness.uen}</Grid.Col>
      <Grid.Col span={12}>
        <Divider my="sm" />
      </Grid.Col>
    </>
  );
  return (
    <form>
      <Grid>
        {conditionalFields}

        <Grid.Col span={KEY_SPAN}>
          <strong>Contact number</strong>
        </Grid.Col>
        <Grid.Col span={VALUE_SPAN}>
          {petOwner ? petOwner.contactNumber : petBusiness.contactNumber}
        </Grid.Col>
        <Grid.Col span={12}>
          <Divider my="sm" />
        </Grid.Col>

        <Grid.Col span={KEY_SPAN}>
          <strong>Email</strong>
        </Grid.Col>
        <Grid.Col span={VALUE_SPAN}>
          {petOwner ? petOwner.email : petBusiness.email}
        </Grid.Col>
      </Grid>

      <Button mt={25} leftIcon={<IconPencil size="1rem" />}>
        Edit
      </Button>
    </form>
  );
};

export default AccountInfoForm;
