import { TextInput, PasswordInput, Anchor } from "@mantine/core";
import { RegularButton } from "@/components/shared/RegularButton";

export const LoginBox = ({ changeBoxToggle, loginForm, handleLogin }: any) => {
  return (
    <form onSubmit={loginForm.onSubmit(handleLogin)}>
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
      <RegularButton text="Login" mt="xs" type="submit" fullWidth />
    </form>
  );
};
