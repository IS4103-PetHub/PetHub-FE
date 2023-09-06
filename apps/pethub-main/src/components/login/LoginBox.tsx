import {
  TextInput,
  PasswordInput,
  Title,
  Anchor,
  Text,
  Center,
  Box,
  SegmentedControl,
  Button,
} from "@mantine/core";
import { IconPawFilled, IconBuildingStore } from "@tabler/icons-react";
import { AccountTypeEnum } from "@/types/constants";

export const LoginBox = ({ loginForm, changeBoxToggle, handleLogin }) => (
  <div>
    <Title align="center">PetHub</Title>
    <Text color="dimmed" size="sm" align="center" mb="sm">
      Welcome to PetHub. Login now!
    </Text>
    <form onSubmit={loginForm.onSubmit(handleLogin)}>
      <SegmentedControl
        fullWidth
        color="dark"
        {...loginForm.getInputProps("accountType")}
        data={[
          {
            value: AccountTypeEnum.PetOwner,
            label: (
              <Center>
                <IconPawFilled size="1rem" />
                <Box ml={10}>Pet Owner</Box>
              </Center>
            ),
          },
          {
            value: AccountTypeEnum.PetBusiness,
            label: (
              <Center>
                <IconBuildingStore size="1rem" />
                <Box ml={10}>Pet Business</Box>
              </Center>
            ),
          },
        ]}
      />
      <TextInput
        label="Email"
        required
        mt="xs"
        {...loginForm.getInputProps("email")}
      />
      <PasswordInput
        label="Password"
        required
        mt="xs"
        {...loginForm.getInputProps("password")}
      />
      <Anchor
        component="button"
        type="button"
        color="dimmed"
        onClick={changeBoxToggle}
        size="xs"
        mt="sm"
      >
        Forgot your password?
      </Anchor>
      <Button mt="xs" type="submit" fullWidth mb="sm">
        Login
      </Button>
    </form>
  </div>
);
