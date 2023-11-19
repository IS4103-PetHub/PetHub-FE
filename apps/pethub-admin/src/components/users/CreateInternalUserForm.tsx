import { Button, TextInput, Container, Grid } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconCheck } from "@tabler/icons-react";
import { AccountTypeEnum, getErrorMessageProps } from "shared-utils";
import { useCreateInternalUser } from "@/hooks/internal-user";
import { InternalUserRoleEnum } from "@/types/constants";
import { CreateInternalUserPayload } from "@/types/types";

export function CreateInternalUserForm({
  onUserCreated,
}: {
  onUserCreated: (success: boolean) => void;
}) {
  const [isCreating, setIsCreating] = useToggle();
  const form = useForm({
    initialValues: {
      accountType: AccountTypeEnum.InternalUser,
      firstName: "",
      lastName: "",
      adminRole: InternalUserRoleEnum.admin,
      email: "",
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
    },
  });

  type FormValues = typeof form.values;

  const createInternalUserMutation = useCreateInternalUser();
  const createInternalUserAccount = async (
    payload: CreateInternalUserPayload,
  ) => {
    try {
      setIsCreating(true);
      await createInternalUserMutation.mutateAsync(payload);
      notifications.show({
        title: "Account Created",
        color: "green",
        icon: <IconCheck />,
        message: `Internal user account created successfully!`,
      });

      setIsCreating(false);
      onUserCreated(true);
    } catch (error: any) {
      setIsCreating(false);
      onUserCreated(false);
      notifications.show({
        ...getErrorMessageProps("Error Creating Account", error),
      });
    }
  };

  function handleSubmit(values: FormValues) {
    const payload: CreateInternalUserPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      adminRole: values.adminRole,
    };
    createInternalUserAccount(payload);
  }

  return (
    <>
      <Container p="10px">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Grid mb="md">
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
          </Grid>
          <Button
            loading={isCreating}
            type="submit"
            fullWidth
            leftIcon={<IconPlus size="1rem" />}
          >
            Create Internal User
          </Button>
        </form>
      </Container>
    </>
  );
}
