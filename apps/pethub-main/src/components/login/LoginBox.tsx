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
import { AccountTypeEnum } from "shared-utils";

export const LoginBox = ({ loginForm, changeBoxToggle, handleLogin }) => (
  <div>
    <Title align="center">PetHub</Title>
    <Text color="dimmed" size="sm" align="center" mb="md">
      Welcome to PetHub. Login now!
    </Text>
    <form onSubmit={loginForm.onSubmit((values) => handleLogin(values))}>
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
        withAsterisk={false}
        mt="xs"
        {...loginForm.getInputProps("email")}
      />
      <PasswordInput
        label="Password"
        required
        withAsterisk={false}
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
      <Button mt="xs" type="submit" fullWidth mb="xs">
        Login
      </Button>
    </form>
  </div>
);
