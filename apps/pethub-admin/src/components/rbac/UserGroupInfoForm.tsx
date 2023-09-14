import { Stack, TextInput, Textarea, Text, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import React from "react";
import EditCancelSaveButtons from "web-ui/shared/EditCancelSaveButtons";
import { UserGroup } from "@/types/types";

interface UserGroupInfoFormProps {
  userGroup?: UserGroup;
}

const UserGroupInfoForm = ({ userGroup }: UserGroupInfoFormProps) => {
  const [isEditing, setIsEditing] = useToggle();
  const form = useForm({
    initialValues: {
      name: userGroup?.name,
      description: userGroup?.description,
    },
  });

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
            <Text>{userGroup?.description}</Text>
          </Box>
        </>
      )}
      <EditCancelSaveButtons
        isEditing={isEditing}
        onClickCancel={handleCancel}
        onClickEdit={() => setIsEditing(true)}
      />
    </form>
  );
};

export default UserGroupInfoForm;
