import {
  Button,
  Divider,
  Group,
  Paper,
  Text,
  Modal,
  Title,
  Grid,
  Col,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";
import { FormEvent } from "react";
import AccountStatusBadge from "web-ui/shared/AccountStatusBadge";
import { formatAccountTypeEnum } from "@/components/util/EnumHelper";
import { useDeleteInternalUser } from "@/hooks/internal-user";
import { AccountTypeEnum } from "@/types/constants";
import { InternalUser, PetBusiness, PetOwner, User } from "@/types/types";
type UserDetailsProps = {
  user: PetOwner | PetBusiness | InternalUser | null;
  onUserDeleted: (success: boolean) => void;
  sessionUserId: number;
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
    <Paper p="md" shadow="xs" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Text align="center" size="xl" weight={500}>
        {userName}
      </Text>
      <Divider my="sm" variant="dashed" />

      <Grid gutter="md">
        <Col span={6}>
          <Text>User ID:</Text>
        </Col>
        <Col span={6}>
          <Text>{user.userId}</Text>
        </Col>

        <Col span={6}>
          <Text>Email:</Text>
        </Col>
        <Col span={6}>
          <Text>{user.email}</Text>
        </Col>

        <Col span={6}>
          <Text>Account Type:</Text>
        </Col>
        <Col span={6}>
          <Text>{formatAccountTypeEnum(user.accountType)}</Text>
        </Col>

        <Col span={6}>
          <Text>Account Status:</Text>
        </Col>
        <Col span={6}>
          <AccountStatusBadge accountStatus={user.accountStatus} size="lg" />
        </Col>

        <Col span={6}>
          <Text>Date Created:</Text>
        </Col>
        <Col span={6}>
          <Text>{new Date(user.dateCreated).toLocaleDateString()}</Text>
        </Col>
        <Col span={6}>
          <Text>Date Last Updated:</Text>
        </Col>
        <Col span={6}>
          <Text>
            {user.lastUpdated
              ? new Date(user.lastUpdated).toLocaleDateString()
              : "-"}
          </Text>
        </Col>
      </Grid>
    </Paper>
  </>
);

const DeleteButton = ({
  user,
  openModal,
}: {
  user: User;
  openModal: () => void;
}) => (
  <Grid gutter="md">
    <Col span={12}>
      <Button
        fullWidth
        variant="outline"
        size="lg"
        onClick={openModal}
        color="red"
      >
        Delete
      </Button>
    </Col>
  </Grid>
);

const InternalUserDetails = ({
  user,
  open,
  userName,
}: {
  user: InternalUser;
  open: () => void;
  userName: string;
}) => (
  <>
    <UserDetail user={user} userName={userName} />
    <Paper p="md" shadow="xs" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Grid gutter="md">
        <Col span={6}>
          <Text>First Name:</Text>
        </Col>
        <Col span={6}>
          <Text>{user.firstName}</Text>
        </Col>

        <Col span={6}>
          <Text>Last Name:</Text>
        </Col>
        <Col span={6}>
          <Text>{user.lastName}</Text>
        </Col>

        <Col span={6}>
          <Text>Admin Role:</Text>
        </Col>
        <Col span={6}>
          <Text>{user.adminRole}</Text>
        </Col>
      </Grid>
    </Paper>
    <DeleteButton user={user} openModal={open} />
  </>
);

const PetBusinessDetails = ({
  user,
  open,
  userName,
}: {
  user: PetBusiness;
  open: () => void;
  userName: string;
}) => (
  <>
    <UserDetail user={user} userName={userName} />
    <Paper p="md" shadow="xs" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Grid gutter="md">
        <Col span={6}>
          <Text>UEN:</Text>
        </Col>
        <Col span={6}>
          <Text>{user.uen}</Text>
        </Col>

        <Col span={6}>
          <Text>Business Type:</Text>
        </Col>
        <Col span={6}>
          <Text>{user.businessType || "-"}</Text>
        </Col>

        <Col span={6}>
          <Text>Business Description:</Text>
        </Col>
        <Col span={6}>
          <Text>{user.businessDescription || "-"}</Text>
        </Col>

        <Col span={6}>
          <Text>Website:</Text>
        </Col>
        <Col span={6}>
          <Text>{user.websiteURL || "-"}</Text>
        </Col>
      </Grid>
    </Paper>
  </>
);

const PetOwnerDetails = ({
  user,
  open,
  userName,
}: {
  user: PetOwner;
  open: () => void;
  userName: string;
}) => (
  <>
    <UserDetail user={user} userName={userName} />
    <Paper p="md" shadow="xs" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Grid gutter="md">
        <Col span={6}>
          <Text>First Name:</Text>
        </Col>
        <Col span={6}>
          <Text>{user.firstName}</Text>
        </Col>

        <Col span={6}>
          <Text>Last Name:</Text>
        </Col>
        <Col span={6}>
          <Text>{user.lastName}</Text>
        </Col>

        <Col span={6}>
          <Text>Date of Birth:</Text>
        </Col>
        <Col span={6}>
          <Text>{new Date(user.dateOfBirth).toLocaleDateString()}</Text>
        </Col>

        <Col span={6}>
          <Text>Contact Number:</Text>
        </Col>
        <Col span={6}>
          <Text>{user.contactNumber}</Text>
        </Col>
      </Grid>
    </Paper>
  </>
);

type DeleteAccountModalProps = {
  closeModal: () => void;
  opened: boolean;
  name: string;
  userId: number;
  onUserDeleted: (success: boolean) => void;
  sessionUserId: number;
};

const DeleteAccountModal = ({
  closeModal,
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

  const deleteInternalUserMutation = useDeleteInternalUser();
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
          message: `Internal User deleted successfully!`,
        });
        onUserDeleted(true);
        closeModal();
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
        onClose={closeModal}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        centered
        padding="1.5rem"
        size="md"
      >
        <Title order={2}>Are you sure you want to delete {name} account?</Title>
        {/* the follow values should be the user ID */}
        <form onSubmit={form.onSubmit(deleteInternalUserAccount)}>
          <Group mt="25px" position="right">
            <Button type="reset" color="gray" onClick={closeModal}>
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

const UserDetails = ({
  user,
  onUserDeleted,
  sessionUserId,
}: UserDetailsProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  if (!user) return null;

  const userName = getUserName(user);
  let UserDetailsComponent = null;

  switch (user.accountType) {
    case AccountTypeEnum.InternalUser:
      UserDetailsComponent = (
        <InternalUserDetails
          user={user as InternalUser}
          open={open}
          userName={userName}
        />
      );
      break;
    case AccountTypeEnum.PetBusiness:
      UserDetailsComponent = (
        <PetBusinessDetails
          user={user as PetBusiness}
          open={open}
          userName={userName}
        />
      );
      break;
    case AccountTypeEnum.PetOwner:
      UserDetailsComponent = (
        <PetOwnerDetails
          user={user as PetOwner}
          open={open}
          userName={userName}
        />
      );
      break;
    default:
      return null;
  }
  return (
    <>
      {UserDetailsComponent}
      <DeleteAccountModal
        closeModal={close}
        opened={opened}
        name={userName}
        userId={user.userId}
        onUserDeleted={onUserDeleted}
        sessionUserId={sessionUserId}
      />
    </>
  );
};

export default UserDetails;
