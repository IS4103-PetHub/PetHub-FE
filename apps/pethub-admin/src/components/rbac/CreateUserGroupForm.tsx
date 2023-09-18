import {
  Stack,
  TextInput,
  Textarea,
  Text,
  Button,
  Grid,
  Divider,
  Group,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";
import { Permission } from "@/types/types";
import PermissionsCheckboxCard from "./PermissionsCheckboxCard";
import SelectAllPermissionsCheckbox from "./SelectAllPermissionsCheckbox";

interface CreateUserGroupFormProps {
  permissions: Permission[];
  form: UseFormReturnType<any>;
  onCreate(values: any): void;
}

const CreateUserGroupForm = ({
  permissions,
  form,
  onCreate,
}: CreateUserGroupFormProps) => {
  const permissionsCheckboxes = (
    <Grid gutter="xl">
      {permissions.map((permission) => (
        <Grid.Col span={6} key={permission.permissionId}>
          <PermissionsCheckboxCard
            permission={permission}
            form={form}
            isEditing
          />
        </Grid.Col>
      ))}
    </Grid>
  );

  return (
    <form onSubmit={form.onSubmit((values: any) => onCreate(values))}>
      <Stack mb="xl">
        <TextInput
          label="Group name"
          placeholder="Group name"
          {...form.getInputProps("name")}
        />
        <Textarea
          label="Description"
          placeholder="Description"
          {...form.getInputProps("description")}
        />
      </Stack>
      <Group position="left">
        <Text size="xl" weight={600} mt="lg" mb="xs">
          Permissions ({form.values.permissionIds.length})
        </Text>
        <SelectAllPermissionsCheckbox permissions={permissions} form={form} />
      </Group>
      <Divider mb="md" />
      {permissionsCheckboxes}
      <Button type="submit" mt="xl" mb="xl" size="md" fullWidth>
        Create User Group
      </Button>
    </form>
  );
};

export default CreateUserGroupForm;
