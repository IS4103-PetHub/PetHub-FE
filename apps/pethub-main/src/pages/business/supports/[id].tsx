import { Accordion, Box, Container, Group } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import {
  AccountStatusEnum,
  SupportTicket,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
import PBCannotAccessMessage from "@/components/common/PBCannotAccessMessage";
import SupportAccordionDetails from "@/components/support/SupportAccordionDetails";
import SupportCommentAccordion from "@/components/support/SupportCommentAccordion";
import { useGetSupportTicketsById } from "@/hooks/support";
import { PetBusiness } from "@/types/types";

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
            <PageTitle
              title={`${
                supportTicket.supportTicketId
              } - ${formatStringToLetterCase(supportTicket.supportCategory)}`}
            />
            <Box>
              <LargeBackButton
                text="Back to Supports"
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
            <SupportAccordionDetails supportTicket={supportTicket} />
            <SupportCommentAccordion
              supportTicket={supportTicket}
              userId={userId}
              refetch={refetchSupportTicket}
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
