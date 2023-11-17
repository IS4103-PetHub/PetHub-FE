import { Card, Text, Button, Group, Badge } from "@mantine/core";
import { useRouter } from "next/router";
import {
  SupportTicketReason,
  SupportTicketStatus,
  formatISODateTimeShort,
  formatStringToLetterCase,
} from "shared-utils";

const SupportTicketCard = ({ ticket }) => {
  const router = useRouter();

  const viewTicketDetails = () => {
    router.push(`/customer/support/${ticket.supportTicketId}`);
  };

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

  return (
    <Card mih={250} shadow="sm" padding="lg" radius="md" withBorder>
      <Group position="apart">
        <Text weight={600}>Ticket ID: {ticket.supportTicketId}</Text>
        <Badge size="lg" color={statusColorMap.get(ticket.status)}>
          {formatStringToLetterCase(ticket.status)}
        </Badge>
      </Group>
      <Text size="sm" color="dimmed">
        Created on: {formatISODateTimeShort(ticket.createdAt)}
      </Text>
      <Badge variant="dot" color={categoryColorMap.get(ticket.supportCategory)}>
        Category: {formatStringToLetterCase(ticket.supportCategory)}
      </Badge>
      <Text mt="xl" fw={500}>
        Description:{" "}
      </Text>
      <Text w="90%" lineClamp={2} sx={{ textOverflow: "ellipsis" }}>
        {ticket.reason}
      </Text>
      <Group position="right" mt="md">
        <Button onClick={viewTicketDetails}>View Details</Button>
      </Group>
    </Card>
  );
};

export default SupportTicketCard;
