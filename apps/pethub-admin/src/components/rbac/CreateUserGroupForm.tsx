import {
  Stack,
  TextInput,
  Textarea,
  Text,
  Button,
  Grid,
  Divider,
  Checkbox,
  Group,
} from "@mantine/core";
import React from "react";
import { Permission } from "@/types/types";
import PermissionsCheckboxCard from "./PermissionsCheckboxCard";

interface CreateUserGroupFormProps {
  permissions: Permission[];
  form: any;
  onCreate(values: any): void;
}

const CreateUserGroupForm = ({
  permissions,
  form,
  onCreate,
}: CreateUserGroupFormProps) => {
  const handleCheckSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      // append all permissions id to checked permissionIds
      form.setFieldValue(
        "permissionIds",
        permissions.map((permission) => permission.permissionId),
      );
    } else {
      // reset permissionIds to empty
      form.setFieldValue("permissionIds", []);
    }
  };

  const permissionsCheckboxes = (
    <Grid gutter="xl">
      {permissions.map((permission) => (
        <Grid.Col span={6} key={permission.permissionId}>
          <PermissionsCheckboxCard permission={permission} form={form} />
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
        <Checkbox
          size="md"
          label="Select all"
          mb={-8}
          checked={form.values.permissionIds.length === permissions.length}
          onChange={(event) => handleCheckSelectAll(event)}
        />
      </Group>
      <Divider mb="md" />
      {permissionsCheckboxes}
      <Button type="submit" mt={50} size="md" fullWidth>
        Create User Group
      </Button>
    </form>
  );
};

export default CreateUserGroupForm;
