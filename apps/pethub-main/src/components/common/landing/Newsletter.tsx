import { Text, Dialog, Group, TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { getErrorMessageProps } from "shared-utils";
import { useSubscribeToNewsletter } from "@/hooks/article";

interface NewsletterProps {
  opened: boolean;
  close: () => void;
}

const Newsletter = ({ opened, close }: NewsletterProps) => {
  const subscribeToNewsletterMutation = useSubscribeToNewsletter();
  const [email, setEmail] = useState("");

  const createArticleComment = async () => {
    try {
      await subscribeToNewsletterMutation.mutateAsync(email);
      notifications.show({
        title: `Subscribed`,
        color: "green",
        icon: <IconCheck />,
        message:
          "You have successfully subscribed to the PetHub email newsletter.",
      });
      close();
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(`Error Publishing Comment`, error),
      });
    }
  };

  return (
    <Dialog
      opened={opened}
      withCloseButton
      onClose={close}
      size="lg"
      radius="md"
    >
      <Text size="md" mb="xs" weight={500}>
        Subscribe to PetHub&apos;s email newsletter
      </Text>
      <Text size="sm" mb="xs" color="dimmed">
        Receive the latest articles on PetHub&apos;s new features, events, tips
        and tricks, and more!
      </Text>
      <Group align="flex-end">
        <TextInput
          placeholder="hello@example.com"
          sx={{ flex: 1 }}
          onChange={(e) => setEmail(e.currentTarget.value)}
          value={email}
        />
        <Button onClick={createArticleComment}>Subscribe</Button>
      </Group>
    </Dialog>
  );
};

export default Newsletter;
