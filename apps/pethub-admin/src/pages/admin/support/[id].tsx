import { Accordion, Box, Container, Group } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import {
  SupportTicketStatus,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import SupportCommentAccordion from "web-ui/shared/support/SupportCommentAccordion";
import api from "@/api/axiosConfig";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import SupportAccordionDetails from "@/components/support/SupportAccordionDetails";
import {
  useGetSupportTickets,
  useGetSupportTicketsById,
  useUpdateSupportTicketComment,
} from "@/hooks/support";
import { PermissionsCodeEnum } from "@/types/constants";
import { Permission } from "@/types/types";
import { commentSupportPayload } from "../../../../../pethub-main/src/types/types";

interface SupportTicketDetailsProps {
  supportTicketId: number;
  userId: number;
  permissions: Permission[];
}

export default function SupportTicketDetails({
  supportTicketId,
  userId,
  permissions,
}: SupportTicketDetailsProps) {
  const router = useRouter();
  // permissions
  // const permissionCodes = permissions.map((permission) => permission.code);
  // const canWrite = permissionCodes.includes(
  //     PermissionsCodeEnum.WriteSupport,
  // );
  // const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadSupport);
  const canWrite = true;
  const canRead = true;

  const { data: supportTicket, refetch: refetchSupportTicket } =
    useGetSupportTicketsById(supportTicketId);

  const { data: supportTickets, refetch: refetchSupportTickets } =
    useGetSupportTickets();

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

  if (!canRead) {
    return <NoPermissionsMessage />;
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
      <Container mt="xl" mb="xl" size="70vw">
        <Group position="apart">
          <Box>
            <LargeBackButton
              text="Back to Supports Tickets"
              onClick={async () => {
                router.push("/admin/support");
              }}
              size="sm"
            />
          </Box>
        </Group>
        <Accordion
          multiple
          variant="filled"
          value={[]}
          onChange={() => {}}
          chevronSize={0}
          mt="md"
        >
          <SupportAccordionDetails
            supportTicket={supportTicket}
            refetch={refetchSupportTicket}
            canWrite={canWrite}
            refetchTableData={refetchSupportTickets}
          />
          <SupportCommentAccordion
            supportTicket={supportTicket}
            userId={userId}
            canEdit={canEdit}
            commentForm={commentForm}
            handleAction={handleAction}
            isAdmin={true}
          />
        </Accordion>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userId = session.user["userId"];
  const supportTicketId = context.params.id;

  const permissions = await (
    await api.get(`/rbac/users/${userId}/permissions`)
  ).data;

  return { props: { supportTicketId, userId, permissions } };
}
