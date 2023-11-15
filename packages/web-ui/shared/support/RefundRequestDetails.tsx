import {
  useMantineTheme,
  Grid,
  Text,
  Badge,
  Box,
  Divider,
  Group,
} from "@mantine/core";
import { IconHelpSquareRounded } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  SupportTicket,
  formatISODateLong,
  formatISODayDateTime,
  formatStringToLetterCase,
} from "shared-utils";
import DeleteActionButtonModal from "../DeleteActionButtonModal";

interface RefundRequestDetailsProps {
  supportTicket: SupportTicket;
  isAdmin?: boolean;
  handleReopenRefund?: () => void;
}

export default function RefundRequestDetails({
  supportTicket,
  isAdmin,
  handleReopenRefund,
}: RefundRequestDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();

  const generateItemGroup = (
    title: string,
    content: ReactNode,
    colProps: any = {},
  ) => {
    return (
      <>
        <Grid.Col span={7} {...colProps}>
          <Text fw={500}>{title}</Text>
        </Grid.Col>
        <Grid.Col span={17} {...colProps}>
          {content}
        </Grid.Col>
      </>
    );
  };

  return (
    <Box mb="md">
      <Group position="apart">
        <Text fw={600} size="md">
          <IconHelpSquareRounded size="1rem" color={theme.colors.indigo[5]} />{" "}
          &nbsp;Refund Request Details
        </Text>
        {isAdmin && supportTicket.refundRequest.status == "REJECTED" && (
          <DeleteActionButtonModal
            title="Reopen Support Ticket"
            onDelete={handleReopenRefund}
            subtitle="Are you sure you want to reopen the Refund Requests"
            large
            largeText="Reopen Support Ticket"
            removeIcon
            overrideDeleteButtonText="Reopen"
            buttonColor="teal"
          />
        )}
      </Group>

      <Grid columns={24} mt="xs">
        {generateItemGroup(
          "Refund Request ID",
          <Text>{supportTicket.refundRequest.refundRequestId}</Text>,
        )}
        {generateItemGroup(
          "Date Created",
          <Text>
            {formatISODateLong(supportTicket.refundRequest.createdAt)}
          </Text>,
        )}
        {generateItemGroup(
          "Status",
          <Badge>
            {formatStringToLetterCase(supportTicket.refundRequest.status)}
          </Badge>,
        )}
        {supportTicket.refundRequest.processedAt &&
          generateItemGroup(
            "Date Processed",
            <Text>
              {formatISODayDateTime(supportTicket.refundRequest.processedAt)}
            </Text>,
          )}
        {generateItemGroup(
          "Pet Owner Reason",
          <Text>{supportTicket.refundRequest.reason}</Text>,
        )}
        {generateItemGroup(
          "Pet Business Comment",
          <Text>
            {supportTicket.refundRequest.comment
              ? supportTicket.refundRequest.comment
              : "-"}
          </Text>,
        )}
      </Grid>
      <Divider mt="lg" mb="lg" />
    </Box>
  );
}
