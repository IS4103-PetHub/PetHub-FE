import {
  Accordion,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconChevronLeft,
  IconListDetails,
  IconPhotoPlus,
} from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { ReactNode, useRef, useState } from "react";
import {
  SupportTicketReason,
  SupportTicketStatus,
  formatEnumValueToLowerCase,
  formatISODayDateTime,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ImageCarousel from "web-ui/shared/ImageCarousel";
import SupportCommentAccordion from "web-ui/shared/support/SupportCommentAccordion";
import {
  useCloseResolveSupportTicket,
  useGetSupportTickets,
  useGetSupportTicketsById,
  useReopenSupportTicket,
  useUpdateSupportTicketComment,
} from "@/hooks/support";
import { commentSupportPayload } from "@/types/types";

interface POSupportTicketDetailsProps {
  supportTicketId: number;
  userId: number;
}

export default function POSupportTicketDetails({
  supportTicketId,
  userId,
}: POSupportTicketDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const OPEN_FOREVER = ["header", "details", "comments"];
  const { data: supportTicket, refetch: refetchSupportTicket } =
    useGetSupportTicketsById(supportTicketId);
  const { data: supportTickets, refetch: refetchSupportTickets } =
    useGetSupportTickets(userId);
  const [backButtonLoading, setBackButtonLoading] = useState(false);
  const [showFullDescriptionReason, toggleShowFullDescriptionReason] =
    useToggle();
  const [textExceedsLineClampReason, setTextExceedsLineClampReason] =
    useState(false);
  const textRefReason = useRef(null);

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
  const handleCommentAction = async () => {
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

  const closeSupportTicketMutation = useCloseResolveSupportTicket(
    supportTicket?.supportTicketId,
  );
  const reopenSupportTicketMutation = useReopenSupportTicket(
    supportTicket?.supportTicketId,
  );
  async function handleAction() {
    try {
      if (canEdit) {
        await closeSupportTicketMutation.mutateAsync();
        notifications.show({
          title: "Support Ticket Closed",
          color: "green",
          icon: <IconCheck />,
          message: `Support Ticket successfully closed`,
        });
      } else {
        await reopenSupportTicketMutation.mutateAsync();
        notifications.show({
          title: "Support Ticket Reopened",
          color: "green",
          icon: <IconCheck />,
          message: `Support Ticket successfully Reopened`,
        });
      }
      refetchSupportTicket();
      refetchSupportTickets();
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Closing Support Ticket", error),
      });
    }
  }

  if (!supportTicketId || !supportTicket) {
    return null;
  }

  const ACCORDION_ITEM_PROPS = {
    pl: 30,
    pr: 30,
    pt: 15,
    pb: 10,
  };

  function goBack() {
    setBackButtonLoading(true);
    window.location.href = "/customer/supports";
  }

  const statusColorMap = new Map([
    [SupportTicketStatus.Pending, "orange"],
    [SupportTicketStatus.InProgress, "orange"],
    [SupportTicketStatus.ClosedResolved, "green"],
    [SupportTicketStatus.ClosedUnresolved, "red"],
  ]);

  const categoryColorMap = new Map([
    [SupportTicketReason.GeneralEnquiry, "blue"],
    [SupportTicketReason.ServiceListing, "cyan"],
    [SupportTicketReason.Orders, "grape"],
    [SupportTicketReason.Appointments, "green"],
    [SupportTicketReason.Payments, "indigo"],
    [SupportTicketReason.Refunds, "orange"],
    [SupportTicketReason.Accounts, "lime"],
    [SupportTicketReason.Others, "gray"],
  ]);

  const canEdit = [
    SupportTicketStatus.Pending,
    SupportTicketStatus.InProgress,
  ].includes(supportTicket?.status);

  const generateItemGroup = (
    title: string,
    content: ReactNode,
    colProps: any = {},
  ) => {
    return (
      <>
        <Grid.Col span={5} {...colProps}>
          <Text fw={500}>{title}</Text>
        </Grid.Col>
        <Grid.Col span={19} {...colProps}>
          {content}
        </Grid.Col>
      </>
    );
  };

  const headerAccordionItem = (
    <Accordion.Item value="header" {...ACCORDION_ITEM_PROPS}>
      <Group position="apart">
        <Button
          variant=""
          leftIcon={
            <IconChevronLeft size="1rem" style={{ marginRight: -10 }} />
          }
          ml={-15}
          c="dimmed"
          loading={backButtonLoading}
          loaderPosition="right"
          loaderProps={{ color: "dark" }}
          onClick={goBack}
        >
          Back
        </Button>
        <Center>
          <Text size="sm">ORDER ITEM ID.</Text>
          &nbsp;
          <Text size="sm">{supportTicket?.supportTicketId}</Text>
          <Text ml="md" mr="md" size="sm">
            |
          </Text>
          <Text
            size="sm"
            color={statusColorMap.get(supportTicket.status)}
            tt="uppercase"
          >
            {formatStringToLetterCase(supportTicket.status)}
          </Text>
        </Center>
      </Group>
    </Accordion.Item>
  );

  const supportTicketDetailsAccordionItem = (
    <Accordion.Item value="details" {...ACCORDION_ITEM_PROPS}>
      <Group position="apart">
        <Text fw={600} size="md">
          <IconListDetails size="1rem" color={theme.colors.indigo[5]} />{" "}
          &nbsp;Support Ticket Overview
        </Text>
        {supportTicket.status != SupportTicketStatus.ClosedResolved && (
          <DeleteActionButtonModal
            title={canEdit ? "Close Support Ticket" : "Reopen Support Ticket"}
            onDelete={() => handleAction()}
            subtitle={
              canEdit
                ? "Are you sure you want to close the support ticket. Once the support ticket is closed, it cannot be reopened."
                : "Are you sure you want to reopen the support ticket."
            }
            large
            largeText={canEdit ? "Close as Resolved" : "Reopen"}
            removeIcon
            overrideDeleteButtonText={canEdit ? "Close" : "Reopen"}
            buttonColor={canEdit ? "red" : "teal"}
          />
        )}
      </Group>
      <Grid columns={24} mt="xs">
        {generateItemGroup(
          "Reason",
          <Box>
            <Text
              lineClamp={showFullDescriptionReason ? 0 : 2}
              ref={textRefReason}
            >
              {supportTicket?.reason}
            </Text>
            <Group position="right">
              <Button
                compact
                variant="subtle"
                color="blue"
                size="xs"
                onClick={() => toggleShowFullDescriptionReason()}
                mt="xs"
                mr="xs"
                display={textExceedsLineClampReason ? "block" : "none"}
              >
                {showFullDescriptionReason ? "View less" : "View more"}
              </Button>
            </Group>
          </Box>,
        )}
        {generateItemGroup(
          "Status",
          <Badge
            color={
              statusColorMap.has(supportTicket?.status)
                ? statusColorMap.get(supportTicket.status)
                : "gray"
            }
          >
            {formatEnumValueToLowerCase(supportTicket?.status)}
          </Badge>,
        )}
        {generateItemGroup(
          "Category",
          <Badge
            color={
              categoryColorMap.has(supportTicket?.supportCategory)
                ? categoryColorMap.get(supportTicket.supportCategory)
                : "gray"
            }
          >
            {formatEnumValueToLowerCase(supportTicket?.supportCategory)}
          </Badge>,
        )}
        {generateItemGroup(
          "Created At",
          <Text>{formatISODayDateTime(supportTicket?.createdAt)}</Text>,
        )}
        {generateItemGroup(
          "Updated At",
          <Text>{formatISODayDateTime(supportTicket?.updatedAt)}</Text>,
        )}
      </Grid>
    </Accordion.Item>
  );

  const attachmentAccordionItem = (
    <Accordion.Item value="details" {...ACCORDION_ITEM_PROPS}>
      <Text fw={600} size="md">
        <IconPhotoPlus size="1rem" color={theme.colors.indigo[5]} />{" "}
        &nbsp;Attachments
      </Text>
      {supportTicket.attachmentURLs.length == 0 ? (
        <Text>No images uploaded</Text>
      ) : (
        <ImageCarousel
          attachmentURLs={supportTicket.attachmentURLs}
          altText="Support Ticket Photo"
          imageHeight={500}
        />
      )}
    </Accordion.Item>
  );

  const commentsAccordionItem = (
    <SupportCommentAccordion
      supportTicket={supportTicket}
      userId={userId}
      canEdit={canEdit}
      commentForm={commentForm}
      handleAction={handleCommentAction}
      isAdmin={false}
    />
  );

  return (
    <>
      <Head>
        <title>View Support Details - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} size="60vw" sx={{ overflow: "hidden" }}>
        {supportTicket && (
          <Accordion
            multiple
            variant="filled"
            value={OPEN_FOREVER}
            chevronSize={0}
          >
            {headerAccordionItem}
            {supportTicketDetailsAccordionItem}
            {attachmentAccordionItem}
            {commentsAccordionItem}
          </Accordion>
        )}
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userId = session.user["userId"];
  const supportTicketId = context.params.id;
  return { props: { supportTicketId, userId } };
}
