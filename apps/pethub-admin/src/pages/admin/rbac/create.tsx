import { Container } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { PageTitle } from "web-ui";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import CreateUserGroupForm from "@/components/rbac/CreateUserGroupForm";
import { useCreateUserGroup, useGetAllPermissions } from "@/hooks/rbac";
import { PermissionsCodeEnum } from "@/types/constants";
import { CreateUserGroupPayload, Permission } from "@/types/types";

interface CreateUserGroupProps {
  userPermissions: Permission[];
}

export default function CreateUserGroup({
  userPermissions,
}: CreateUserGroupProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  //permissions
  const permissionCodes = userPermissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(PermissionsCodeEnum.WriteRbac);

  const { data: permissions = [] } = useGetAllPermissions();
  const createUserGroupMutation = useCreateUserGroup(queryClient);

  const emptyNumberArr: number[] = [];
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      permissionIds: emptyNumberArr,
    },

    validate: {
      name: isNotEmpty("Name required."),
    },
  });

  const handleCreateUserGroup = async (values: any) => {
    const payload: CreateUserGroupPayload = {
      ...values,
    };
    try {
      const data = await createUserGroupMutation.mutateAsync(payload);
      notifications.show({
        title: "User Group Created",
        color: "green",
        icon: <IconCheck />,
        message: `User group created successfully!`,
      });
      // redirect to group details page
      router.push(`/admin/rbac/user-groups/${data.groupId}`);
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
    <>
      <Head>
        <title>Create User Group - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {canWrite ? (
        <Container fluid>
          <PageTitle title="Create User Group" mb="md" />
          <CreateUserGroupForm
            permissions={permissions}
            form={form}
            onCreate={handleCreateUserGroup}
          />
        </Container>
      ) : (
        <NoPermissionsMessage />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const userPermissions = await (
    await axios.get(
      `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/rbac/users/${userId}/permissions`,
    )
  ).data;
  return { props: { userPermissions } };
}
