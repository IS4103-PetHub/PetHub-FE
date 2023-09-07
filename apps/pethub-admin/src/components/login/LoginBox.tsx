import { TextInput, PasswordInput, Anchor } from "@mantine/core";
import { RegularButton } from "../common/RegularButton";

export const LoginBox = ({ changeBoxToggle, loginForm, handleLogin }: any) => {
  return (
    <form onSubmit={loginForm.onSubmit((values: any) => handleLogin(values))}>
      <TextInput
        label="Email"
        required
        withAsterisk={false}
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
      <RegularButton text="Login" mt="xs" type="submit" fullWidth />
    </form>
  );
};
