import { Card, Checkbox, Text } from "@mantine/core";
import React from "react";
import { Permission } from "@/types/types";

interface PermissionsCheckboxCardProps {
  permission: Permission;
  form: any;
}

const PermissionsCheckboxCard = ({
  permission,
  form,
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
      <Checkbox
        size="md"
        value={permission.permissionId}
        label={<Text weight={500}>{permission.name}</Text>}
        checked={form.values.permissionIds.includes(permission.permissionId)}
        onChange={(event) => handleCheckPermission(event)}
      />
      <Text size="sm" color="dimmed" ml={36} mt={5}>
        {permission.description}
      </Text>
    </Card>
  );
};

export default PermissionsCheckboxCard;
