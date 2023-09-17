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
  onClose(): void;
}

const TagForm = ({ form, onCreate, onClose }: TagFormProps) => {
  return (
    <form onSubmit={form.onSubmit((values: any) => onCreate(values))}>
      <Grid mt="md" mb="md">
        <Grid.Col span={12}>
          <TextInput
            label="Input tag name"
            placeholder="Tag name"
            withAsterisk
            {...form.getInputProps("name")}
          />
        </Grid.Col>
      </Grid>
      <Group mt="25px" position="right">
        <Button type="reset" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </Group>
    </form>
  );
};

export default TagForm;
