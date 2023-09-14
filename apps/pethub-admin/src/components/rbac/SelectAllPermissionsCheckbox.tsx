import { Checkbox } from "@mantine/core";
import React from "react";
import { Permission } from "@/types/types";

interface SelectAllPermissionsCheckboxProps {
  permissions: Permission[];
  form: any;
}

const SelectAllPermissionsCheckbox = ({
  permissions,
  form,
}: SelectAllPermissionsCheckboxProps) => {
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

  return (
    <Checkbox
      size="md"
      label="Select all"
      mb={-8}
      checked={form.values.permissionIds.length === permissions.length}
      onChange={(event) => handleCheckSelectAll(event)}
    />
  );
};

export default SelectAllPermissionsCheckbox;
