import { Card, Checkbox, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";
import { Permission } from "@/types/types";

interface PermissionsCheckboxCardProps {
  permission: Permission;
  form: UseFormReturnType<any>;
  isEditing?: boolean;
}

const PermissionsCheckboxCard = ({
  permission,
  form,
  isEditing,
}: PermissionsCheckboxCardProps) => {
  const handleCheckPermission = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.currentTarget.checked) {
      // append this permission's id to checked permissionIds
      form.setFieldValue("permissionIds", [
        ...form.values.permissionIds,
        permission.permissionId,
      ]);
    } else {
      // remove this permission's id from checked permissionIds
      form.setFieldValue(
        "permissionIds",
        form.values.permissionIds.filter(
          (x: number) => x !== permission.permissionId,
        ),
      );
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="sm" withBorder>
      {isEditing ? (
        <Checkbox
          size="md"
          value={permission.permissionId}
          label={<Text weight={500}>{permission.name}</Text>}
          checked={form.values.permissionIds.includes(permission.permissionId)}
          onChange={(event) => handleCheckPermission(event)}
        />
      ) : (
        <Text weight={500}>{permission.name}</Text>
      )}
      <Text size="sm" color="dimmed" ml={isEditing ? 36 : 0} mt={5}>
        {permission.description}
      </Text>
    </Card>
  );
};

export default PermissionsCheckboxCard;
