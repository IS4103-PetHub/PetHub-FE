import {
  Button,
  Divider,
  Group,
  Paper,
  Text,
  Modal,
  Title,
  Grid,
  TextInput,
  List,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { FormEvent } from "react";
import { formatStringToLetterCase } from "shared-utils";
import AccountStatusBadge from "web-ui/shared/AccountStatusBadge";
import {
  useDeleteInternalUser,
  useUpdateInternalUser,
} from "@/hooks/internal-user";
import { useGetPermissionsByUserIdAndAccountType } from "@/hooks/rbac";
import { AccountTypeEnum, InternalUserRoleEnum } from "@/types/constants";
import {
  InternalUser,
  Permission,
  PetBusiness,
  PetOwner,
  User,
} from "@/types/types";
type UserDetailsProps = {
  user: PetOwner | PetBusiness | InternalUser | null;
  onUserDeleted?: (success: boolean) => void;
  onUserUpdated?: (success: boolean) => void;
  sessionUserId?: number;
  disabled?: boolean;
};

const getUserName = (user: any): string => {
  switch (user.accountType) {
    case AccountTypeEnum.InternalUser:
    case AccountTypeEnum.PetOwner:
      return `${user.firstName} ${user.lastName}`;
    case AccountTypeEnum.PetBusiness:
      return user.companyName;
    default:
      return "";
  }
};

const UserDetail = ({ user, userName }: { user: User; userName: string }) => (
  <>
    <Paper p="md" pt={0} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Text align="center" size="xl" weight={500}>
        {userName}
      </Text>
      <Divider my="md" />

      <Grid gutter="md">
        <Grid.Col span={6}>
          <Text>User ID:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{user.userId}</Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text>Email:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{user.email}</Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text>Account Type:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{formatStringToLetterCase(user.accountType)}</Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text>Account Status:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <AccountStatusBadge accountStatus={user.accountStatus} size="lg" />
        </Grid.Col>

        <Grid.Col span={6}>
          <Text>Date Created:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{new Date(user.dateCreated).toLocaleDateString()}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>Date Last Updated:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>
            {user.lastUpdated
              ? new Date(user.lastUpdated).toLocaleDateString()
              : "-"}
          </Text>
        </Grid.Col>
      </Grid>
    </Paper>
  </>
);

const DeleteButton = ({ openDeleteModal }: { openDeleteModal: () => void }) => (
  <Button
    fullWidth
    variant="outline"
    size="md"
    onClick={openDeleteModal}
    color="red"
    mt="xs"
  >
    Delete
  </Button>
);

const UpdateButton = ({ openUpdateModal }: { openUpdateModal: () => void }) => (
  <Button
    fullWidth
    variant="outline"
    size="md"
    onClick={openUpdateModal}
    mt="xs"
  >
    Edit
  </Button>
);

const InternalUserDetails = ({
  user,
  openDeleteModal,
  openUpdateModal,
  userName,
  permissions,
}: {
  user: InternalUser;
  openDeleteModal: () => void;
  openUpdateModal: () => void;
  userName: string;
  permissions: Permission[];
}) => (
  <>
    <UserDetail user={user} userName={userName} />
    <Paper p="md" pt={0} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Grid gutter="md">
        <Grid.Col span={6}>
          <Text>First Name:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{user.firstName}</Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text>Last Name:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{user.lastName}</Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text>Permissions:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          {permissions.length > 0 ? (
            <List type="ordered">
              {permissions.map((permission) => (
                <List.Item mb={5} key={permission.permissionId}>
                  {permission.name}
                </List.Item>
              ))}
            </List>
          ) : (
            "-"
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          <UpdateButton openUpdateModal={openUpdateModal} />
        </Grid.Col>
        <Grid.Col span={6}>
          <DeleteButton openDeleteModal={openDeleteModal} />
        </Grid.Col>
      </Grid>
    </Paper>
  </>
);

const PetBusinessDetails = ({
  user,
  userName,
}: {
  user: PetBusiness;
  userName: string;
}) => (
  <>
    <UserDetail user={user} userName={userName} />
    <Paper p="md" pt={0} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Grid gutter="md">
        <Grid.Col span={6}>
          <Text>UEN:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{user.uen}</Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text>Contact Number:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{user.contactNumber}</Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text>Business Type:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{user.businessType || "-"}</Text>
        </Grid.Col>

        {/* <Grid.Col span={6}>
          <Text>Business Description:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{user.businessDescription || "-"}</Text>
        </Grid.Col> */}

        <Grid.Col span={6}>
          <Text>Website:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{user.websiteURL || "-"}</Text>
        </Grid.Col>
      </Grid>
    </Paper>
  </>
);

const PetOwnerDetails = ({
  user,
  userName,
}: {
  user: PetOwner;
  userName: string;
}) => (
  <>
    <UserDetail user={user} userName={userName} />
    <Paper p="md" pt={0} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Grid gutter="md">
        <Grid.Col span={6}>
          <Text>First Name:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{user.firstName}</Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text>Last Name:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{user.lastName}</Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text>Date of Birth:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{new Date(user.dateOfBirth).toLocaleDateString()}</Text>
        </Grid.Col>

        <Grid.Col span={6}>
          <Text>Contact Number:</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>{user.contactNumber}</Text>
        </Grid.Col>
      </Grid>
    </Paper>
  </>
);

//Delete Logic
type DeleteAccountModalProps = {
  closeDeleteModal: () => void;
  opened: boolean;
  name: string;
  userId: number;
  onUserDeleted: (success: boolean) => void;
  sessionUserId: number;
};

const DeleteAccountModal = ({
  closeDeleteModal,
  opened,
  name,
  userId,
  onUserDeleted,
  sessionUserId,
}: DeleteAccountModalProps) => {
  const form = useForm({
    initialValues: {
      userId: userId,
    },
  });
  const queryClient = useQueryClient();
  const deleteInternalUserMutation = useDeleteInternalUser(queryClient);
  const deleteInternalUserAccount = async (
    values: { userId: number },
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (sessionUserId !== userId) {
      try {
        await deleteInternalUserMutation.mutateAsync(userId);
        notifications.show({
          title: "Account Deleted",
          color: "green",
          icon: <IconCheck />,
          message: `Internal user ID: ${userId} deleted successfully!`,
        });
        onUserDeleted(true);
        closeDeleteModal();
      } catch (error: any) {
        onUserDeleted(false);
        notifications.show({
          title: "Error Deleting Account",
          color: "red",
          icon: <IconX />,
          message:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message,
        });
      }
    } else {
      onUserDeleted(false);
      notifications.show({
        title: "Error Deleting Account",
        color: "red",
        icon: <IconX />,
        message: "You are trying to delete yourself!",
      });
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeDeleteModal}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        centered
        padding="1.5rem"
        size="md"
      >
        <Title
          order={2}
        >{`Are you sure you want to delete ${name}'s account?`}</Title>
        <Text mt="md">This action cannot be undone.</Text>
        <form onSubmit={form.onSubmit(deleteInternalUserAccount)}>
          <Group mt="md" position="right">
            <Button type="reset" color="gray" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button color="red" type="submit">
              Delete
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

//Update Logic
type UpdateInternalUserModalProps = {
  closeUpdateModal: () => void;
  opened: boolean;
  user: InternalUser;
  onUserUpdated: (success: boolean) => void;
};

const UpdateInternalUserModal = ({
  closeUpdateModal,
  opened,
  user,
  onUserUpdated,
}: UpdateInternalUserModalProps) => {
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  type FormValues = typeof form.values;
  const updateInternalUserMutation = useUpdateInternalUser(queryClient);
  const updateInternalUserAccount = async (payload: any) => {
    try {
      await updateInternalUserMutation.mutateAsync(payload);
      notifications.show({
        title: "Account Updated",
        color: "green",
        icon: <IconCheck />,
        message: `Internal user updated successfully!`,
      });
      onUserUpdated(true);
      closeUpdateModal();
    } catch (error: any) {
      onUserUpdated(false);
      notifications.show({
        title: "Error Updating Account",
        color: "red",
        icon: <IconX />,
        message: error.message,
      });
    }
  };

  function handleSubmit(values: FormValues) {
    const payload = {
      userId: user.userId,
      firstName: values.firstName,
      lastName: values.lastName,
      //default to create adminRole ADMINISTRATOR
      adminRole: InternalUserRoleEnum.admin,
    };
    updateInternalUserAccount(payload);
  }

  return (
    <Modal
      opened={opened}
      onClose={closeUpdateModal}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      centered
      padding="1.5rem"
      size="md"
    >
      <Title order={2}>Update User Details</Title>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Grid mt="md" mb="md">
          <Grid.Col span={12}>
            <TextInput
              label="First name"
              placeholder="First name"
              {...form.getInputProps("firstName")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Last name"
              placeholder="Last name"
              {...form.getInputProps("lastName")}
            />
          </Grid.Col>
        </Grid>
        <Group mt="md" position="right">
          <Button type="reset" color="gray" onClick={closeUpdateModal}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </Group>
      </form>
    </Modal>
  );
};

const UserDetails = ({
  user,
  onUserDeleted,
  sessionUserId,
  onUserUpdated,
  disabled,
}: UserDetailsProps) => {
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [updateModalOpened, { open: openUpdate, close: closeUpdate }] =
    useDisclosure(false);
  // const propSessionUserId = sessionUserId || -1;
  // const propOnUserDeleted = onUserDeleted || ((_success: boolean) => {});
  // const propOnUserUpdated = onUserUpdated || ((_success: boolean) => {});

  const { data: internalUserPermissions = [] } =
    useGetPermissionsByUserIdAndAccountType(user?.userId, user?.accountType);

  if (!user) return null;

  const userName = getUserName(user);
  let UserDetailsComponent = null;

  switch (user.accountType) {
    case AccountTypeEnum.InternalUser:
      UserDetailsComponent = (
        <InternalUserDetails
          user={user as InternalUser}
          openDeleteModal={openDelete}
          openUpdateModal={openUpdate}
          userName={userName}
          permissions={internalUserPermissions}
        />
      );
      break;
    case AccountTypeEnum.PetBusiness:
      UserDetailsComponent = (
        <PetBusinessDetails user={user as PetBusiness} userName={userName} />
      );
      break;
    case AccountTypeEnum.PetOwner:
      UserDetailsComponent = (
        <PetOwnerDetails user={user as PetOwner} userName={userName} />
      );
      break;
    default:
      return null;
  }
  return (
    <>
      {UserDetailsComponent}
      {disabled ? null : (
        <>
          <DeleteAccountModal
            closeDeleteModal={closeDelete}
            opened={deleteModalOpened}
            name={userName}
            userId={user.userId}
            onUserDeleted={onUserDeleted}
            sessionUserId={sessionUserId}
          />
          <UpdateInternalUserModal
            closeUpdateModal={closeUpdate}
            opened={updateModalOpened}
            user={user as InternalUser}
            onUserUpdated={onUserUpdated}
          />
        </>
      )}
    </>
  );
};

export default UserDetails;
