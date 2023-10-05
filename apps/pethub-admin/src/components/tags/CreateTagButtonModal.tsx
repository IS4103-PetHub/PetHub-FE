import { Modal, Title } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import { CreateTagPayload } from "@/types/types";
import TagForm from "./TagForm";

interface CreateTagButtonModalProps {
  onCreate(payload: CreateTagPayload): void;
}

const CreateTagButtonModal = ({ onCreate }: CreateTagButtonModalProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: "",
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
    const payload: CreateTagPayload = {
      ...values,
    };
    onCreate(payload);
    form.reset();
    close();
  }

  const closeAndReset = () => {
    form.reset();
    close();
  };

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
        <Title order={2}>Create Tag</Title>
        <TagForm form={form} onCreate={handleSubmit} onClose={closeAndReset} />
      </Modal>
      <LargeCreateButton text="Create Tag" onClick={open} />
    </>
  );
};

export default CreateTagButtonModal;
