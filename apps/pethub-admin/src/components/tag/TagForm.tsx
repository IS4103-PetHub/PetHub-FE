import {
  Stack,
  TextInput,
  Textarea,
  Text,
  Button,
  Grid,
  Divider,
  Checkbox,
  Group,
} from "@mantine/core";
import React from "react";

interface TagFormProps {
  form: any;
  onCreate(values: any): void;
}

const TagForm = ({ form, onCreate }: TagFormProps) => {
  return (
    <form onSubmit={form.onSubmit((values: any) => onCreate(values))}>
      <Stack mb="xl">
        <TextInput
          label="Tag name"
          placeholder="Tag name"
          withAsterisk
          {...form.getInputProps("name")}
        />
      </Stack>
      <Divider mb="md" />
      <Button type="submit" mt="md" size="md" fullWidth>
        Create Tag
      </Button>
    </form>
  );
};

export default TagForm;
