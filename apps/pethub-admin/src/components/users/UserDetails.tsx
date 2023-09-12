import {
  Button,
  Divider,
  Group,
  Paper,
  Text,
  Modal,
  Title,
  Badge,
  Container,
  Grid,
  Col,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { formatAccountTypeEnum } from "@/components/util/EnumHelper";
import { AccountStatusEnum, AccountTypeEnum } from "@/types/constants";
import { InternalUser, PetBusiness, PetOwner } from "@/types/types";
type UserDetailsProps = {
  user: PetOwner | PetBusiness | InternalUser | null;
  // onDeactivate: () => void; This method should call hook to deactivate user acc
  // onActivate: () => void; This method should call hook to activate user acc
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
  // const userType = user ? user.accountType : null;
  // const typedUser =
  //   userType === AccountTypeEnum.InternalUser
  //     ? (user as InternalUser)
  //     : userType === AccountTypeEnum.PetBusiness
  //     ? (user as PetBusiness)
  //     : userType === AccountTypeEnum.PetOwner
  //     ? (user as PetOwner)
  //     : user; //default

  // const displayName =
  //   userType === AccountTypeEnum.InternalUser ||
  //   userType === AccountTypeEnum.PetOwner
  //     ? (typedUser as InternalUser | PetOwner).firstName +
  //       " " +
  //       (typedUser as InternalUser | PetOwner).lastName
  //     : userType === AccountTypeEnum.PetBusiness
  //     ? (typedUser as PetBusiness).companyName
  //     : ""; //default

  switch (user.accountType) {
    case AccountTypeEnum.InternalUser:
      const internalUser = user as InternalUser;
      return (
        <Paper
          p="md"
          shadow="xs"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <Container size="md">
            <Text align="center" size="xl" weight={500}>
              {internalUser.firstName} {internalUser.lastName}
            </Text>
            <Divider my="sm" variant="dashed" />

            <Grid gutter="md">
              <Col span={6}>
                <Text>User ID:</Text>
              </Col>
              <Col span={6}>
                <Text>{internalUser.userId}</Text>
              </Col>

              <Col span={6}>
                <Text>First Name:</Text>
              </Col>
              <Col span={6}>
                <Text>{internalUser.firstName}</Text>
              </Col>

              <Col span={6}>
                <Text>Last Name:</Text>
              </Col>
              <Col span={6}>
                <Text>{internalUser.lastName}</Text>
              </Col>

              <Col span={6}>
                <Text>Admin Role:</Text>
              </Col>
              <Col span={6}>
                <Text>{internalUser.adminRole}</Text>
              </Col>

              <Col span={6}>
                <Text>Email:</Text>
              </Col>
              <Col span={6}>
                <Text>{internalUser.email}</Text>
              </Col>

              <Col span={6}>
                <Text>Account Type:</Text>
              </Col>
              <Col span={6}>
                <Text>{formatAccountTypeEnum(internalUser.accountType)}</Text>
              </Col>

              <Col span={6}>
                <Text>Account Status:</Text>
              </Col>
              <Col span={6}>
                <Badge
                  color={
                    internalUser.accountStatus === AccountStatusEnum.Active
                      ? "green"
                      : "red"
                  }
                >
                  {internalUser.accountStatus}
                </Badge>
              </Col>

              <Col span={6}>
                <Text>Date Created:</Text>
              </Col>
              <Col span={6}>
                <Text>
                  {new Date(internalUser.dateCreated).toLocaleDateString()}
                </Text>
              </Col>
              <Col span={6}>
                <Text>Date Last Updated:</Text>
              </Col>
              <Col span={6}>
                <Text>
                  {internalUser.lastUpdated
                    ? new Date(internalUser.lastUpdated).toLocaleDateString()
                    : "-"}
                </Text>
              </Col>
            </Grid>

            <Divider my="md" />

            <Group spacing="md" position="center">
              <Button onClick={open} color="red">
                Deactivate
              </Button>
              <Button color="teal">Activate</Button>
            </Group>

            <DeactivateAccountModal
              closeModal={close}
              opened={opened}
              name={internalUser.firstName + " " + internalUser.lastName}
            />
          </Container>
        </Paper>
      );
    case AccountTypeEnum.PetBusiness:
      const petBusiness = user as PetBusiness;
      return (
        <Paper
          p="md"
          shadow="xs"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <Container size="md">
            <Text align="center" size="xl" weight={500}>
              {petBusiness.companyName}
            </Text>
            <Divider my="sm" variant="dashed" />

            <Grid gutter="md">
              <Col span={6}>
                <Text>User ID:</Text>
              </Col>
              <Col span={6}>
                <Text>{petBusiness.userId}</Text>
              </Col>

              <Col span={6}>
                <Text>UEN:</Text>
              </Col>
              <Col span={6}>
                <Text>{petBusiness.uen}</Text>
              </Col>

              <Col span={6}>
                <Text>Business Type:</Text>
              </Col>
              <Col span={6}>
                <Text>{petBusiness.businessType || "-"}</Text>
              </Col>

              <Col span={6}>
                <Text>Business Description:</Text>
              </Col>
              <Col span={6}>
                <Text>{petBusiness.businessDescription || "-"}</Text>
              </Col>

              <Col span={6}>
                <Text>Website:</Text>
              </Col>
              <Col span={6}>
                <Text>{petBusiness.websiteURL || "-"}</Text>
              </Col>

              <Col span={6}>
                <Text>Email:</Text>
              </Col>
              <Col span={6}>
                <Text>{petBusiness.email}</Text>
              </Col>

              <Col span={6}>
                <Text>Account Type:</Text>
              </Col>
              <Col span={6}>
                <Text>{formatAccountTypeEnum(petBusiness.accountType)}</Text>
              </Col>

              <Col span={6}>
                <Text>Account Status:</Text>
              </Col>
              <Col span={6}>
                <Badge
                  color={
                    petBusiness.accountStatus === AccountStatusEnum.Active
                      ? "green"
                      : "red"
                  }
                >
                  {petBusiness.accountStatus}
                </Badge>
              </Col>

              <Col span={6}>
                <Text>Date Created:</Text>
              </Col>
              <Col span={6}>
                <Text>
                  {new Date(petBusiness.dateCreated).toLocaleDateString()}
                </Text>
              </Col>

              <Col span={6}>
                <Text>Date Last Updated:</Text>
              </Col>
              <Col span={6}>
                <Text>
                  {petBusiness.lastUpdated
                    ? new Date(petBusiness.lastUpdated).toLocaleDateString()
                    : "-"}
                </Text>
              </Col>
            </Grid>

            <Divider my="md" />

            <Group spacing="md" position="center">
              <Button onClick={open} color="red">
                Deactivate
              </Button>
              <Button color="teal">Activate</Button>
            </Group>

            <DeactivateAccountModal
              closeModal={close}
              opened={opened}
              name={petBusiness.companyName}
            />
          </Container>
        </Paper>
      );
    case AccountTypeEnum.PetOwner:
      const petOwner = user as PetOwner;
      return (
        <Paper
          p="md"
          shadow="xs"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <Container size="md">
            <Text align="center" size="xl" weight={500}>
              {petOwner.firstName} {petOwner.lastName}
            </Text>
            <Divider my="sm" variant="dashed" />

            <Grid gutter="md">
              <Col span={6}>
                <Text>User ID:</Text>
              </Col>
              <Col span={6}>
                <Text>{petOwner.userId}</Text>
              </Col>

              <Col span={6}>
                <Text>First Name:</Text>
              </Col>
              <Col span={6}>
                <Text>{petOwner.firstName}</Text>
              </Col>

              <Col span={6}>
                <Text>Last Name:</Text>
              </Col>
              <Col span={6}>
                <Text>{petOwner.lastName}</Text>
              </Col>

              <Col span={6}>
                <Text>Date of Birth:</Text>
              </Col>
              <Col span={6}>
                <Text>
                  {new Date(petOwner.dateOfBirth).toLocaleDateString()}
                </Text>
              </Col>

              <Col span={6}>
                <Text>Contact Number:</Text>
              </Col>
              <Col span={6}>
                <Text>{petOwner.contactNumber}</Text>
              </Col>

              <Col span={6}>
                <Text>Email:</Text>
              </Col>
              <Col span={6}>
                <Text>{petOwner.email}</Text>
              </Col>

              <Col span={6}>
                <Text>Account Type:</Text>
              </Col>
              <Col span={6}>
                <Text>{formatAccountTypeEnum(petOwner.accountType)}</Text>
              </Col>

              <Col span={6}>
                <Text>Account Status:</Text>
              </Col>
              <Col span={6}>
                <Badge
                  color={
                    petOwner.accountStatus === AccountStatusEnum.Active
                      ? "green"
                      : "red"
                  }
                >
                  {petOwner.accountStatus}
                </Badge>
              </Col>

              <Col span={6}>
                <Text>Date Created:</Text>
              </Col>
              <Col span={6}>
                <Text>
                  {new Date(petOwner.dateCreated).toLocaleDateString()}
                </Text>
              </Col>

              <Col span={6}>
                <Text>Date Last Updated:</Text>
              </Col>
              <Col span={6}>
                <Text>
                  {petOwner.lastUpdated
                    ? new Date(petOwner.lastUpdated).toLocaleDateString()
                    : "-"}
                </Text>
              </Col>
            </Grid>

            <Divider my="md" />

            <Group spacing="md" position="center">
              <Button onClick={open} color="red">
                Deactivate
              </Button>
              <Button color="teal">Activate</Button>
            </Group>

            <DeactivateAccountModal
              closeModal={close}
              opened={opened}
              name={petOwner.firstName + " " + petOwner.lastName}
            />
          </Container>
        </Paper>
      );
  }
};

export default UserDetails;
