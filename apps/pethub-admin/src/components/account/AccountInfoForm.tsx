import { Grid, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import EditCancelSaveButtons from "web-ui/shared/EditCancelSaveButtons";
import { useUpdateInternalUser } from "@/hooks/internal-user";
import { InternalUser } from "@/types/types";

interface AccountInfoFormProps {
  internalUser: InternalUser;
  refetch(): void;
}

const AccountInfoForm = ({ internalUser, refetch }: AccountInfoFormProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useToggle();

  const formDefaultValues = {
    email: internalUser?.email ?? "",
  };

  const form = useForm({
    initialValues: formDefaultValues,

    validate: {
      email: isEmail("Invalid email."),
    },
  });

  useEffect(() => {
    // update form values from fetched object
    form.setValues(formDefaultValues);
  }, [internalUser]);

  const updateInternalUserMutation = useUpdateInternalUser(queryClient);

  const KEY_SPAN = 3;
  const VALUE_SPAN = 12 - KEY_SPAN;

  const handleCancel = () => {
    setIsEditing(false);
    form.setValues(formDefaultValues);
  };

  type FormValues = typeof form.values;
  const handleUpdateInternalUser = async (values: FormValues) => {
    const payload = {
      userId: internalUser.userId,
      email: values.email,
    };

    try {
      await updateInternalUserMutation.mutateAsync(payload);

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

  return (
    <form
      onSubmit={form.onSubmit((values) => handleUpdateInternalUser(values))}
    >
      <Grid>
        <Grid.Col span={KEY_SPAN}>
          <strong>First name</strong>
        </Grid.Col>
        <Grid.Col span={VALUE_SPAN}>
          {isEditing ? (
            <TextInput value={internalUser?.firstName} disabled />
          ) : (
            internalUser?.firstName
          )}
        </Grid.Col>

        <Grid.Col span={KEY_SPAN}>
          <strong>Last name</strong>
        </Grid.Col>
        <Grid.Col span={VALUE_SPAN}>
          {isEditing ? (
            <TextInput value={internalUser?.lastName} disabled />
          ) : (
            internalUser?.lastName
          )}
        </Grid.Col>

        <Grid.Col span={KEY_SPAN}>
          <strong>Email</strong>
        </Grid.Col>
        <Grid.Col span={VALUE_SPAN}>
          {isEditing ? (
            <TextInput placeholder="Email" {...form.getInputProps("email")} />
          ) : (
            internalUser?.email
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
