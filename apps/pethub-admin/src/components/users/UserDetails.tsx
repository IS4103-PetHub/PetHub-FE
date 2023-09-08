import {
  Button,
  Divider,
  Group,
  Paper,
  Text,
  Modal,
  Title,
  Badge,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { InternalUser, PetBusiness, PetOwner } from "@/types/types";
type UserDetailsProps = {
  user: PetOwner | PetBusiness | InternalUser | null;
  // onDeactivate: () => void;
  // onActivate: () => void;
};

type DeactivateAccountModalProps = {
  closeModal: () => void;
  opened: boolean;
  name: string;
};

const DeactivateAccountModal = ({
  closeModal,
  opened,
  name,
}: DeactivateAccountModalProps) => {
  const form = useForm({
    initialValues: {
      userId: "",
    },
  });

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
        <Title order={2}>
          Are you sure you want to deactivate {name} account?
        </Title>
        {/* the follow values should be the user ID */}
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Group mt="25px" position="right">
            <Button type="reset" color="gray" onClick={closeModal}>
              Cancel
            </Button>
            <Button color="red" type="submit">
              Deactivate
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

const UserDetails = ({ user }: UserDetailsProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  if (!user) return null;
  switch (user.accountType) {
    case "INTERNAL_USER":
      return <div>Admin</div>;
    case "PET_BUSINESS":
      return <div>PetBusiness</div>;
    case "Pet Owner":
      const petOwner = user as PetOwner;
      return (
        <Paper p="md" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Text align="center" size="xl" weight={500}>
            {petOwner.firstName} {petOwner.lastName}
          </Text>
          <Divider my="sm" variant="dashed" />
          <Group spacing="lg" position="center">
            <Text>Account Type: {petOwner.accountType}</Text>
            <Text>Account Status: </Text>
            <Badge
              color={petOwner.accountStatus === "ACTIVE" ? "green" : "red"}
            >
              {" "}
              {petOwner.accountStatus}
            </Badge>
            <Group spacing="md" position="center">
              <Button onClick={open} color="red">
                Deactivate
              </Button>
              <Button color="teal">
                {/* <Button onClick={onActivate} color="teal"> */}
                Activate
              </Button>
            </Group>
            <DeactivateAccountModal
              closeModal={close}
              opened={opened}
              name={petOwner.firstName + " " + petOwner.lastName}
            />
          </Group>
        </Paper>
      );
  }
};

export default UserDetails;
