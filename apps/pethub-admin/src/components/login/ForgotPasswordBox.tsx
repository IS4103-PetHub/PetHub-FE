import {
  TextInput,
  Anchor,
  Text,
  Group,
  Center,
  Box,
  rem,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { RegularButton } from "../common/RegularButton";

export const ForgotPasswordBox = ({
  changeBoxToggle,
  isForgotPasswordSuccessful,
  forgotPasswordForm,
  handleForgotPassword,
  isSubmitButtonLoading,
}: any) => {
  return isForgotPasswordSuccessful ? (
    <Text c="dimmed" fz="md" ta="center">
      A confirmation email has been sent to your inbox.
    </Text>
  ) : (
    <form onSubmit={forgotPasswordForm.onSubmit(handleForgotPassword)}>
      <TextInput
        label="Email"
        required
        {...forgotPasswordForm.getInputProps("email")}
      />
      <Group position="apart" mt="lg">
        <Anchor color="dimmed" size="sm">
          <Center inline onClick={changeBoxToggle}>
            <IconArrowLeft size={rem(12)} stroke={1.5} />
            <Box ml={5}>Go back</Box>
          </Center>
        </Anchor>
        <RegularButton
          text="Reset Password"
          type="submit"
          loading={isSubmitButtonLoading}
        />
      </Group>
    </form>
  );
};
