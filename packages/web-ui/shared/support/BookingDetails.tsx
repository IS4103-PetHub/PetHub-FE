import {
  useMantineTheme,
  Grid,
  Text,
  Box,
  Divider,
  Button,
  Group,
} from "@mantine/core";
import { IconCalendarEvent, IconPhotoPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  SupportTicket,
  formatISODayDateTime,
  formatNumber2Decimals,
} from "shared-utils";

interface BookingDetailsProps {
  supportTicket: SupportTicket;
  isAdmin?: boolean;
}

export default function BookingDetails({
  supportTicket,
  isAdmin,
}: BookingDetailsProps) {
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
          <IconCalendarEvent size="1rem" color={theme.colors.indigo[5]} />{" "}
          &nbsp;Booking Details
        </Text>
        {isAdmin && (
          <Button
            color="indigo"
            onClick={() =>
              router.push(`/admin/orders/${supportTicket.booking.orderItemId}`)
            }
          >
            View
          </Button>
        )}
      </Group>
      <Grid columns={24} mt="xs">
        {generateItemGroup(
          "Booking ID",
          <Text>{supportTicket.booking.bookingId}</Text>,
        )}
        {generateItemGroup(
          "Start Time",
          <Text>{formatISODayDateTime(supportTicket.booking.startTime)}</Text>,
        )}
        {generateItemGroup(
          "End Time",
          <Text>{formatISODayDateTime(supportTicket.booking.endTime)}</Text>,
        )}
        {generateItemGroup(
          "Order Item Name",
          <Text>{supportTicket.booking.OrderItem.itemName}</Text>,
        )}
        {generateItemGroup(
          "Price",
          <Text>
            ${" "}
            {formatNumber2Decimals(supportTicket.booking.OrderItem?.itemPrice)}
          </Text>,
        )}
        {generateItemGroup(
          "Pet Owner Name",
          <Text>
            {supportTicket.booking.OrderItem.invoice?.PetOwner?.firstName}{" "}
            {supportTicket.booking.OrderItem.invoice?.PetOwner?.lastName}
          </Text>,
        )}
        {generateItemGroup(
          "Pet Owner Contact No.",
          <Text>
            {supportTicket.booking.OrderItem.invoice.PetOwner.contactNumber}
          </Text>,
        )}
        {generateItemGroup(
          "Pet Owner Email",
          <Text>
            {supportTicket.booking.OrderItem.invoice.PetOwner.user.email}
          </Text>,
        )}
      </Grid>
      <Divider mt="lg" mb="lg" />
    </Box>
  );
}
