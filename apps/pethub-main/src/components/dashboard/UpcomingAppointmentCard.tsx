import { Badge, Card, Group, Text } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import RainbowBadge from "web-ui/shared/RainbowBadge";
import { Booking } from "@/types/types";

interface UpcomingAppointmentCardProps {
  booking: Booking;
}
const UpcomingAppointmentCard = ({ booking }: UpcomingAppointmentCardProps) => {
  const badgeText = `${dayjs(booking.startTime).format("h:mma")}
   - 
  ${dayjs(booking.endTime).format("h:mma")}`;
  return (
    <Card shadow="sm" mt="xs">
      <Group>
        <RainbowBadge size="lg" radius="xs" text={badgeText} />
        <Text fw={500}>{booking.serviceListing.title}</Text>
      </Group>
    </Card>
  );
};

export default UpcomingAppointmentCard;
