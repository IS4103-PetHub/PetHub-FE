import { Box, Grid, Text } from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import React from "react";
import EditCancelSaveButtons from "web-ui/shared/EditCancelSaveButtons";
import { useGetAllPermissions } from "@/hooks/rbac";
import { UserGroup } from "@/types/types";
import PermissionsCheckboxCard from "./PermissionsCheckboxCard";
import SelectAllPermissionsCheckbox from "./SelectAllPermissionsCheckbox";

interface UserGroupPermissionsForm {
  userGroup?: UserGroup;
  form: UseFormReturnType<any>;
  isEditing: boolean;
  onCancel(): void;
  onClickEdit(): void;
  onSubmit(values: any): void;
  disabled?: boolean;
}

const UserGroupPermissionsForm = ({
  userGroup,
  form,
  isEditing,
  onCancel,
  onClickEdit,
  onSubmit,
  disabled,
}: UserGroupPermissionsForm) => {
  const { data: permissions = [] } = useGetAllPermissions();

  const permissionsToMap = isEditing
    ? permissions
    : userGroup?.userGroupPermissions?.map(
        (userGroupPermission) => userGroupPermission.permission,
      ) ?? [];

  const permissionsCheckboxes = (
    <Grid gutter="xl">
      {permissionsToMap.map((permission) => (
        <Grid.Col span={6} key={permission.permissionId}>
          <PermissionsCheckboxCard
            permission={permission}
            form={form}
            isEditing={isEditing}
          />
        </Grid.Col>
      ))}
    </Grid>
  );

  return (
    <form onSubmit={form.onSubmit((values: any) => onSubmit(values))}>
      {isEditing ? (
        <Box mb="md" ml="lg">
          <SelectAllPermissionsCheckbox permissions={permissions} form={form} />
        </Box>
      ) : null}

      {userGroup?.userGroupPermissions?.length === 0 && !isEditing ? (
        <Text color="dimmed" mb="md">
          No permissions assigned
        </Text>
      ) : null}

      {permissionsCheckboxes}
      {disabled ? null : (
        <EditCancelSaveButtons
          isEditing={isEditing}
          onClickCancel={onCancel}
          onClickEdit={onClickEdit}
        />
      )}
    </form>
  );
};

export default UserGroupPermissionsForm;
