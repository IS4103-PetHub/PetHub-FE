import {
  TextInput,
  Title,
  Anchor,
  Text,
  Group,
  Center,
  Box,
  Button,
  rem,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

export const ForgotPasswordBox = ({
  forgotPasswordForm,
  toggle,
  handleForgotPassword,
  isForgotPasswordSuccessful,
}) => (
  <div>
    <Title align="center" fz="xl">
      Forgot your password?
    </Title>
    <Text c="dimmed" fz="sm" ta="center" mt="sm">
      Enter your email address to get a reset link if your email address is tied
      to an account in our system.
    </Text>
    {isForgotPasswordSuccessful ? (
      <Text c="dimmed" fz="md" ta="center">
        Password reset request successful. Please check your inbox.
      </Text>
    ) : (
      <form onSubmit={forgotPasswordForm.onSubmit(handleForgotPassword)}>
        <TextInput
          mt={20}
          label="Email"
          required
          {...forgotPasswordForm.getInputProps("email")}
        />
        <Group position="apart" mt="lg" mb="md">
          <Anchor color="dimmed" size="sm">
            <Center inline onClick={() => toggle()}>
              <IconArrowLeft size={rem(12)} stroke={1.5} />
              <Box ml={5}>Go back</Box>
            </Center>
          </Anchor>
          <Button type="submit">Reset Password</Button>
        </Group>
      </form>
    )}
  </div>
);
