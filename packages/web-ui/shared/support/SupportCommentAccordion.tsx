import {
  Accordion,
  ActionIcon,
  Group,
  ScrollArea,
  Text,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { IconMessageCircle, IconSend } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { SupportTicket } from "shared-utils";
import SupportCommentBubble from "web-ui/shared/support/SupportCommentBubble";
import SupportCommentModal from "web-ui/shared/support/SupportCommentModal";

interface SupportCommentAccordionProps {
  supportTicket: SupportTicket;
  userId: number;
  canEdit: boolean;
  handleAction(): void;
  commentForm: any;
  isAdmin: boolean;
}

export default function SupportCommentAccordion({
  supportTicket,
  userId,
  canEdit,
  handleAction,
  commentForm,
  isAdmin,
}: SupportCommentAccordionProps) {
  const theme = useMantineTheme();
  const viewport = useRef<HTMLDivElement>(null);
  const comments = supportTicket.comments;
  const userName = supportTicket.petBusiness
    ? supportTicket.petBusiness.companyName
    : `${supportTicket.petOwner.firstName} ${supportTicket.petOwner.lastName}`;

  useEffect(() => {
    if (viewport.current) {
      viewport.current!.scrollTo({
        top: viewport.current!.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [comments]);

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
              isAdmin={isAdmin}
              userName={userName}
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
            w="85%"
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
