import { Accordion, Box, Container, Group } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import {
  AccountStatusEnum,
  SupportTicket,
  SupportTicketStatus,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import SupportCommentAccordion from "web-ui/shared/support/SupportCommentAccordion";
import api from "@/api/axiosConfig";
import PBCannotAccessMessage from "@/components/common/PBCannotAccessMessage";
import SupportAccordionDetails from "@/components/support/SupportAccordionDetails";
import {
  useGetSupportTickets,
  useGetSupportTicketsById,
  useUpdateSupportTicketComment,
} from "@/hooks/support";
import { PetBusiness, commentSupportPayload } from "@/types/types";

interface PBSUpportTicketDetailsProps {
  supportTicketId: number;
  userId: number;
  canView: boolean;
}

export default function PBSupportTicketDetails({
  supportTicketId,
  userId,
  canView,
}: PBSUpportTicketDetailsProps) {
  const router = useRouter();
  const OPEN_FOREVER = ["details", "comments"];
  const { data: supportTicket, refetch: refetchSupportTicket } =
    useGetSupportTicketsById(supportTicketId);

  const { data: supportTickets, refetch: refetchSupportTickets } =
    useGetSupportTickets(userId);

  const canEdit = [
    SupportTicketStatus.Pending,
    SupportTicketStatus.InProgress,
  ].includes(supportTicket?.status);

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
    supportTicket?.supportTicketId,
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
      refetchSupportTicket();
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Creating Comment", error),
      });
    }
  };

  if (!supportTicketId || !supportTicket) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {supportTicket.supportTicketId} -{" "}
          {formatStringToLetterCase(supportTicket.supportCategory)}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {!canView ? (
        <PBCannotAccessMessage />
      ) : (
        <Container mt="xl" mb="xl" size="70vw">
          <Group position="apart">
            <Box>
              <LargeBackButton
                text="Back to Supports Tickets"
                onClick={async () => {
                  router.push("/business/supports");
                }}
                size="sm"
              />
            </Box>
          </Group>
          <Accordion
            multiple
            variant="filled"
            value={OPEN_FOREVER}
            onChange={() => {}}
            chevronSize={0}
            mt="md"
          >
            <SupportAccordionDetails
              supportTicket={supportTicket}
              refetch={refetchSupportTicket}
              canEdit={canEdit}
              refetchTableData={refetchSupportTickets}
            />
            <SupportCommentAccordion
              supportTicket={supportTicket}
              userId={userId}
              canEdit={canEdit}
              commentForm={commentForm}
              handleAction={handleAction}
              isAdmin={false}
            />
          </Accordion>
        </Container>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userId = session.user["userId"];
  const accountStatus = session.user["accountStatus"];
  const supportTicketId = context.params.id;
  const petBusiness = (await (
    await api.get(`/users/pet-businesses/${userId}`)
  ).data) as PetBusiness;

  const canView =
    accountStatus !== AccountStatusEnum.Pending &&
    petBusiness.petBusinessApplication;

  return { props: { supportTicketId, userId, canView } };
}
