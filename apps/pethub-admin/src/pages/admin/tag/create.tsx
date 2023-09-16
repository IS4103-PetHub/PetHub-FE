import { Container, Group } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { PageTitle } from "web-ui";
import BackButton from "web-ui/shared/BackButton";
import TagForm from "@/components/tag/TagForm";
import { useCreateTag } from "@/hooks/tag";
import { CreateTagPayload } from "@/types/types";

export default function CreateTag() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createTagMutation = useCreateTag(queryClient);

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

  const handleCreateTag = async (values: any) => {
    const payload: CreateTagPayload = {
      ...values,
    };
    try {
      await createTagMutation.mutateAsync(payload);
      notifications.show({
        title: "Tag Created",
        color: "green",
        icon: <IconCheck />,
        message: `Tag created successfully!`,
      });
      // redirect to tag page
      router.push("/tag");
    } catch (error: any) {
      notifications.show({
        title: "Error Creating Tag",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
  };

  return (
    <Container fluid>
      <Group position="apart" mb="xl">
        <PageTitle title="Create Tag" mb="md" />
        <BackButton text="Back" onClick={() => router.push("/tag")} />
      </Group>
      <TagForm form={form} onCreate={handleCreateTag} />
    </Container>
  );
}
