import {
  Container,
  Stack,
  TextInput,
  Textarea,
  Text,
  Divider,
  Checkbox,
  Table,
  Grid,
  Card,
  Button,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { PageTitle } from "web-ui";
import { useGetAllPermissions } from "@/hooks/rbac";

export default function CreateUserGroup() {
  const emptyNumberArr: number[] = [];
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      permissions: emptyNumberArr,
    },

    validate: {
      name: isNotEmpty("Name required."),
      description: isNotEmpty("Description required."),
    },
  });

  const { data: permissions = [] } = useGetAllPermissions();

  const permissionsCheckboxes = (
    <Grid gutter="xl">
      {permissions.map((permission) => (
        <Grid.Col span={6} key={permission.permissionId}>
          <Card shadow="sm" padding="lg" radius="sm" withBorder>
            <Checkbox
              size="md"
              value={permission.permissionId}
              label={<Text weight={500}>{permission.name}</Text>}
              onChange={(event) =>
                event.currentTarget.checked
                  ? form.setFieldValue("permissions", [
                      ...form.values.permissions,
                      permission.permissionId,
                    ])
                  : form.setFieldValue(
                      "permissions",
                      form.values.permissions.filter(
                        (x) => x !== permission.permissionId,
                      ),
                    )
              }
            />
            <Text size="sm" color="dimmed" ml={36} mt={5}>
              {permission.description}
            </Text>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );

  return (
    <Container fluid>
      <PageTitle title="Create User Group" mb="md" />
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
        <Text size="xl" weight={600} mt="lg" mb="xs">
          Permissions ({form.values.permissions.length})
        </Text>
        <Divider mb="md" />
        {permissionsCheckboxes}
        <Button type="submit" mt={50} size="md" fullWidth>
          Create User Group
        </Button>
      </form>
    </Container>
  );
}
