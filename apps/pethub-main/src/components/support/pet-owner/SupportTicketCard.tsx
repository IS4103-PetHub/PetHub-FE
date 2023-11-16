import { Card, Text, Button, Group, Badge } from "@mantine/core";
import { useRouter } from "next/router";
import {
  SupportTicketReason,
  SupportTicketStatus,
  formatStringToLetterCase,
} from "shared-utils";

const SupportTicketCard = ({ ticket }) => {
  const router = useRouter();

  const viewTicketDetails = () => {
    router.push(`/customer/supports/${ticket.supportTicketId}`);
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
      <Text weight={500}>Ticket ID: {ticket.supportTicketId}</Text>
      <Text size="sm" color="dimmed">
        Created At: {new Date(ticket.createdAt).toLocaleDateString()}
      </Text>
      <Text mt={"xl"}>
        Reason: <br /> {ticket.reason}
      </Text>
      <Text mt={"xl"}>
        Category:{" "}
        <Badge color={categoryColorMap.get(ticket.supportCategory)}>
          {formatStringToLetterCase(ticket.supportCategory)}
        </Badge>
      </Text>
      <Text mt={"xl"}>
        Status:{" "}
        <Badge color={statusColorMap.get(ticket.status)}>
          {formatStringToLetterCase(ticket.status)}
        </Badge>
      </Text>
      <Group position="right" mt="md">
        <Button onClick={viewTicketDetails}>View Details</Button>
      </Group>
    </Card>
  );
};

export default SupportTicketCard;
