import {
  TextInput,
  Title,
  Anchor,
  Text,
  Group,
  Box,
  Stack,
  Center,
  Button,
  Divider,
  rem,
} from "@mantine/core";
import { IconArrowLeft, IconMailFast } from "@tabler/icons-react";

export const ForgotPasswordBox = ({
  forgotPasswordForm,
  toggle,
  handleForgotPassword,
  isForgotPasswordSuccessful,
  isSubmitButtonLoading,
}) => (
  <div>
    {!isForgotPasswordSuccessful && (
      <>
        <Title align="center" fz="xl">
          Forgot your password?
        </Title>
        <Text c="dimmed" fz="sm" ta="center" mt="sm" mb="sm">
          Enter your email address to get a reset link if your email address is
          tied to an account in our system.
        </Text>
      </>
    )}
    {isForgotPasswordSuccessful ? (
      <Stack mb="lg">
        <Title align="center" fz="xl" mb="lg">
          Password Reset Requested
        </Title>
        <Divider />
        <Text c="dimmed" fz="md" ta="center" mt="md">
          You have requested to reset your password, please check your inbox for
          an email link.
        </Text>
      </Stack>
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
          <Button type="submit" loading={isSubmitButtonLoading}>
            Reset Password
          </Button>
        </Group>
      </form>
    )}
  </div>
);
