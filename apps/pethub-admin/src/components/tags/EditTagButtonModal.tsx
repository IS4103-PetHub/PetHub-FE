import { Modal, Title, Button, Group, Grid, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import EditActionButton from "web-ui/shared/EditActionButton";
import { UpdateTagPayload } from "@/types/types";

interface EditTagButtonModalProps {
  tagId: number;
  currentName: string;
  onUpdate(payload: UpdateTagPayload): void;
}

const EditTagButtonModal = ({
  tagId,
  currentName,
  onUpdate,
}: EditTagButtonModalProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: currentName,
    },
    validate: {
      name: (value) =>
        isNotEmpty("Name required.") && value.length > 16
          ? "Name should be a maximum of 16 characters."
          : null,
    },
  });

  type FormValues = typeof form.values;

  function handleSubmit(values: FormValues) {
    const payload: UpdateTagPayload = {
      tagId: tagId,
      name: values.name,
    };
    onUpdate(payload);
    close();
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        centered
        padding="1.5rem"
        size="md"
      >
        <Title order={2}>Update Tag Details</Title>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Grid mt="md" mb="md">
            <Grid.Col span={12}>
              <TextInput
                label="Input new name"
                placeholder="Tag Name"
                {...form.getInputProps("name")}
              />
            </Grid.Col>
          </Grid>
          <Group mt="25px" position="right">
            <Button type="reset" color="gray" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Modal>
      <EditActionButton onClick={open} />
    </>
  );
};

export default EditTagButtonModal;
