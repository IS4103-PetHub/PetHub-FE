import { Stack, TextInput, Textarea, Text, Box } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";
import EditCancelSaveButtons from "web-ui/shared/EditCancelSaveButtons";
import { UserGroup } from "@/types/types";

interface UserGroupInfoFormProps {
  userGroup?: UserGroup;
  form: UseFormReturnType<any>;
  isEditing: boolean;
  onCancel(): void;
  onClickEdit(): void;
  onSubmit(values: any): void;
}

const UserGroupInfoForm = ({
  userGroup,
  form,
  isEditing,
  onCancel,
  onClickEdit,
  onSubmit,
}: UserGroupInfoFormProps) => {
  return (
    <form onSubmit={form.onSubmit((values: any) => onSubmit(values))}>
      {isEditing ? (
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
      ) : (
        <>
          <Box mb="md">
            <Text weight="600">Group name:</Text>
            <Text>{userGroup?.name}</Text>
          </Box>
          <Box>
            <Text weight="600">Description:</Text>
            <Text>{userGroup?.description ? userGroup?.description : "-"}</Text>
          </Box>
        </>
      )}
      <EditCancelSaveButtons
        isEditing={isEditing}
        onClickCancel={onCancel}
        onClickEdit={onClickEdit}
      />
    </form>
  );
};

export default UserGroupInfoForm;
