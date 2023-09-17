import { Divider, Grid, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { TransformedValues, isEmail, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { formatISODateString } from "shared-utils";
import EditCancelSaveButtons from "web-ui/shared/EditCancelSaveButtons";
import { useUpdatePetBusiness } from "@/hooks/pet-business";
import { useUpdatePetOwner } from "@/hooks/pet-owner";
import { AccountStatusEnum } from "@/types/constants";
import { PetBusiness, PetOwner } from "@/types/types";
import { validateWebsiteURL } from "@/util";

interface AccountInfoFormProps {
  petOwner?: PetOwner;
  petBusiness?: PetBusiness;
  refetch(): void;
}

const AccountInfoForm = ({
  petOwner,
  petBusiness,
  refetch,
}: AccountInfoFormProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useToggle();

  const formDefaultValues = {
    companyName: petBusiness ? petBusiness.companyName : "",
    uen: petBusiness ? petBusiness.uen : "",
    firstName: petOwner ? petOwner.firstName : "",
    lastName: petOwner ? petOwner.lastName : "",
    dateOfBirth: petOwner ? new Date(petOwner.dateOfBirth) : "",
    contactNumber: petOwner
      ? petOwner.contactNumber
      : petBusiness.contactNumber,
    email: petOwner ? petOwner.email : petBusiness.email,
    businessEmail: petBusiness ? petBusiness.businessEmail : "",
    websiteURL: petBusiness ? petBusiness.websiteURL : "",
    businessDescription: petBusiness ? petBusiness.businessDescription : "",
    businessAddresses: petBusiness ? petBusiness.businessAddresses : [],
  };

  const form = useForm({
    initialValues: formDefaultValues,

    transformValues: (values) => ({
      ...values,
      dateOfBirth: petOwner ? new Date(values.dateOfBirth).toISOString() : "",
    }),

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
      businessEmail: (value) =>
        value && !isEmail("Invalid email.") ? "Invalid email." : null,
      websiteURL: (value) =>
        value && validateWebsiteURL(value)
          ? "Website must start with http:// or https://"
          : null,
      businessDescription: (value) => null,
      businessAddresses: (value) => null,
    },
  });

  useEffect(() => {
    // update form values from fetched object
    form.setValues(formDefaultValues);
  }, [petOwner, petBusiness]);

  const updatePetOwnerMutation = useUpdatePetOwner(queryClient);
  const updatePetBusinessMutation = useUpdatePetBusiness(queryClient);

  if (!petOwner && !petBusiness) {
    return null;
  }

  const KEY_SPAN = petOwner ? 3 : 4;
  const VALUE_SPAN = 12 - KEY_SPAN;
  const BUSINESS_DESCRIPTION_MAX_CHARACTERS = 50;

  const updateAccount = async (payload: any) => {
    try {
      if (petOwner) {
        await updatePetOwnerMutation.mutateAsync(payload);
      } else {
        // pet business
        await updatePetBusinessMutation.mutateAsync(payload);
      }
      setIsEditing(false);
      notifications.show({
        title: "Account Updated",
        color: "green",
        icon: <IconCheck />,
        message: `Account updated successfully!`,
      });
      refetch();
      form.setValues(formDefaultValues);
    } catch (error: any) {
      notifications.show({
        title: "Error Updating Account",
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

  const handleCancel = () => {
    setIsEditing(false);
    form.setValues(formDefaultValues);
  };

  const handleSubmit = (values: TransformedValues<typeof form>) => {
    console.log("HELLO");
    const valuesToUpdate = {};
    let payload = {};

    if (petOwner) {
      // get only the changed values
      Object.keys(form.values).forEach((key) => {
        if (values[key] !== petOwner[key] && values[key] !== "") {
          valuesToUpdate[key] = values[key];
        }
      });
      payload = {
        userId: petOwner.userId,
        ...valuesToUpdate,
      };
    } else {
      // pet business
      Object.keys(form.values).forEach((key) => {
        if (values[key] !== petBusiness[key] && values[key] !== "") {
          valuesToUpdate[key] = values[key];
        }
      });
      payload = {
        userId: petBusiness.userId,
        ...valuesToUpdate,
        businessAddresses: petBusiness.businessAddresses, // Addresses have to be passed in regardless of changes
      };
    }
    if (Object.keys(valuesToUpdate).length === 0) {
      setIsEditing(false);
      return;
    }
    updateAccount(payload);
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
            placeholder="Company name"
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
            disabled
          />
        ) : (
          petBusiness.uen
        )}
      </Grid.Col>
      <Grid.Col span={12}>
        <Divider my="sm" />
      </Grid.Col>

      {petBusiness?.petBusinessApplication?.petBusinessApplicationId &&
        petBusiness.accountStatus !== AccountStatusEnum.Pending && (
          <>
            {" "}
            <Grid.Col span={KEY_SPAN}>
              <strong>Business email</strong>
            </Grid.Col>
            <Grid.Col span={VALUE_SPAN}>
              {isEditing ? (
                <TextInput
                  placeholder="Business email"
                  {...form.getInputProps("businessEmail")}
                />
              ) : (
                petBusiness.businessEmail
              )}
            </Grid.Col>
            <Grid.Col span={12}>
              <Divider my="sm" />
            </Grid.Col>
            <Grid.Col span={KEY_SPAN}>
              <strong>Website URL</strong>
            </Grid.Col>
            <Grid.Col span={VALUE_SPAN}>
              {isEditing ? (
                <TextInput
                  placeholder="Website URL"
                  {...form.getInputProps("websiteURL")}
                />
              ) : (
                petBusiness.websiteURL
              )}
            </Grid.Col>
            <Grid.Col span={12}>
              <Divider my="sm" />
            </Grid.Col>
            <Grid.Col span={KEY_SPAN}>
              <strong>Business description</strong>
            </Grid.Col>
            <Grid.Col span={VALUE_SPAN}>
              {isEditing ? (
                <Textarea
                  autosize
                  minRows={3}
                  maxRows={3}
                  placeholder="Business description"
                  {...form.getInputProps("businessDescription")}
                />
              ) : (
                <Textarea
                  autosize
                  minRows={3}
                  maxRows={3}
                  disabled
                  placeholder="Business description"
                  {...form.getInputProps("businessDescription")}
                />
              )}
            </Grid.Col>
            <Grid.Col span={12}>
              <Divider my="sm" />
            </Grid.Col>
          </>
        )}
    </>
  );

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Grid>
        {conditionalFields}

        <Grid.Col span={KEY_SPAN}>
          <strong>Contact number</strong>
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
      <EditCancelSaveButtons
        isEditing={isEditing}
        onClickCancel={handleCancel}
        onClickEdit={() => setIsEditing(true)}
      />
    </form>
  );
};

export default AccountInfoForm;
