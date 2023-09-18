import { Group, Button } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import React from "react";

interface EditCancelSaveButtonsProps {
  isEditing: boolean;
  onClickCancel(): void;
  onClickEdit(): void;
}

const EditCancelSaveButtons = ({
  isEditing,
  onClickCancel,
  onClickEdit,
}: EditCancelSaveButtonsProps) => {
  return (
    <Group mt={25}>
      <Button
        type="reset"
        display={isEditing ? "block" : "none"}
        color="gray"
        onClick={onClickCancel}
      >
        Cancel
      </Button>
      <Button
        display={isEditing ? "none" : "block"}
        leftIcon={<IconPencil size="1rem" />}
        onClick={onClickEdit}
      >
        Edit
      </Button>
      <Button type="submit" display={isEditing ? "block" : "none"}>
        Save
      </Button>
    </Group>
  );
};

export default EditCancelSaveButtons;
