import {
  Accordion,
  ActionIcon,
  Avatar,
  Box,
  Container,
  Divider,
  FileInput,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Text,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconMessageCircle,
  IconMessageCircle2Filled,
  IconPaperclip,
  IconSend,
} from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { SupportTicket, getErrorMessageProps } from "shared-utils";
import { useUpdateSupportTicketComment } from "@/hooks/support";
import { commentSupportPayload } from "@/types/types";
import SupportCommentBubble from "./SupportCommentBubble";
import SupportCommentModal from "./SupportCommentModal";

interface SupportCommentAccordionProps {
  supportTicket: SupportTicket;
  userId: number;
  refetch(): void;
  canEdit: boolean;
}

export default function SupportCommentAccordion({
  supportTicket,
  userId,
  refetch,
  canEdit,
}: SupportCommentAccordionProps) {
  const theme = useMantineTheme();
  const viewport = useRef<HTMLDivElement>(null);
  const comments = supportTicket.comments;

  useEffect(() => {
    if (viewport.current) {
      viewport.current!.scrollTo({
        top: viewport.current!.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [comments]);

  const initialValues = {
    comment: "",
    files: [],
  };
  const commentForm = useForm({
    initialValues: initialValues,
    validate: {
      comment: isNotEmpty("Comment cannot be empty."),
    },
  });

  const updateSupportTicketCommentMutation = useUpdateSupportTicketComment(
    supportTicket.supportTicketId,
  );
  const handleAction = async () => {
    try {
      const values = commentForm.values;
      const payload: commentSupportPayload = {
        comment: values.comment,
        userId: userId,
        files: values.files,
      };
      await updateSupportTicketCommentMutation.mutateAsync(payload);
      commentForm.reset();
      refetch();
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Creating Service Listing", error),
      });
    }
  };

  return (
    <Accordion.Item value="comments" pl={30} pr={30} pt={15} pb={10}>
      <Group position="apart" mt={5} mb={15}>
        <Text fw={600} size="md">
          <IconMessageCircle size="1rem" color={theme.colors.indigo[5]} />{" "}
          &nbsp;Support Ticket Overview
        </Text>
      </Group>

      {comments.length > 0 ? (
        <ScrollArea h={500} viewportRef={viewport}>
          {comments.map((comment) => (
            <SupportCommentBubble
              key={comment.commentId}
              comment={comment}
              userId={userId}
            />
          ))}
        </ScrollArea>
      ) : (
        <Text mb="lg">No comments yet</Text>
      )}

      <form>
        <Group>
          <SupportCommentModal
            commentForm={commentForm}
            handleAction={handleAction}
            canEdit={canEdit}
          />
          <Textarea
            w="90%"
            autosize
            disabled={!canEdit}
            {...commentForm.getInputProps("comment")}
          />
          <ActionIcon disabled={!canEdit}>
            <IconSend
              color={theme.colors.blue[5]}
              onClick={() => handleAction()}
            />
          </ActionIcon>
        </Group>
      </form>
    </Accordion.Item>
  );
}
