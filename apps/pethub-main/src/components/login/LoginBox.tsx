import {
  TextInput,
  PasswordInput,
  Anchor,
  Text,
  Center,
  Box,
  Image,
  SegmentedControl,
  Button,
} from "@mantine/core";
import { IconPawFilled, IconBuildingStore } from "@tabler/icons-react";
import { AccountTypeEnum } from "shared-utils";

const LoginBox = ({ loginForm, changeBoxToggle, handleLogin }) => {
  return (
    <>
      <Center>
        <Image
          src="/pethub-logo-black.png"
          height={60}
          mb="md"
          width="auto"
          alt="PetHub Logo"
        />
      </Center>
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
        <Button
          mt="xs"
          type="submit"
          fullWidth
          mb="xs"
          color="dark"
          className="gradient-hover"
        >
          Login
        </Button>
      </form>
    </>
  );
};

export default LoginBox;
