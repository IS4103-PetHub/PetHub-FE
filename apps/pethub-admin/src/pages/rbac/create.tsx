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
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Router, useRouter } from "next/router";
import { PageTitle } from "web-ui";
import PermissionsCheckboxCard from "@/components/rbac/PermissionsCheckboxCard";
import UserGroupForm from "@/components/rbac/UserGroupForm";
import { useCreateUserGroup, useGetAllPermissions } from "@/hooks/rbac";
import { CreateUserGroupPayload } from "@/types/types";

export default function CreateUserGroup() {
  const router = useRouter();
  const { data: permissions = [] } = useGetAllPermissions();
  const createUserGroupMutation = useCreateUserGroup();

  const emptyNumberArr: number[] = [];
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      permissionIds: emptyNumberArr,
    },

    validate: {
      name: isNotEmpty("Name required."),
      description: isNotEmpty("Description required."),
    },
  });

  const handleCreateUserGroup = async (values: any) => {
    const payload: CreateUserGroupPayload = {
      ...values,
    };
    try {
      await createUserGroupMutation.mutateAsync(payload);
      notifications.show({
        title: "User Group Created",
        color: "green",
        icon: <IconCheck />,
        message: `User group created successfully!`,
      });
      // redirect to RBAC page
      router.push("/rbac");
    } catch (error: any) {
      notifications.show({
        title: "Error Creating User Group",
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
      <PageTitle title="Create User Group" mb="md" />
      <UserGroupForm
        permissions={permissions}
        form={form}
        onCreate={handleCreateUserGroup}
      />
    </Container>
  );
}
