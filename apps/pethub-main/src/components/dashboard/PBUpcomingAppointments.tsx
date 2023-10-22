import {
  Button,
  Center,
  Divider,
  Group,
  Paper,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { formatISOLongWithDay } from "shared-utils";
import { Booking } from "@/types/types";
import UpcomingAppointmentCard from "./UpcomingAppointmentCard";

interface PBUpcomingAppointmentsProps {
  bookings: Booking[];
  daysAhead: number;
}

const PBUpcomingAppointments = ({
  bookings,
  daysAhead,
}: PBUpcomingAppointmentsProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  // iso date string, booking[]
  const [bookingsMap, setBookingsMap] = useState<Map<string, Booking[]>>(
    new Map(),
  );

  // for display
  const startString = dayjs(new Date()).format("D MMM");
  const endString = dayjs(new Date())
    // minus 1 day because end date is exclusive
    .add(daysAhead - 1, "day")
    .format("D MMM");

  function processBookings() {
    const newMap = new Map<string, Booking[]>([]);
    const now = new Date();
    for (let i = 0; i < daysAhead; i++) {
      const currentDate = dayjs(now).add(i, "day");
      const bookingsOnCurrentDate = bookings
        .filter((booking) =>
          dayjs(booking.startTime).isSame(currentDate, "day"),
        )
        .sort((a, b) => (dayjs(a.startTime).isAfter(b.startTime) ? 1 : -1));
      newMap.set(dayjs(now).add(i, "day").toISOString(), bookingsOnCurrentDate);
    }
    setBookingsMap(newMap);
  }

  useEffect(() => processBookings(), []);

  const renderContent = () => {
    if (bookings.length === 0) {
      // no upcoming bookings
      return (
        <Paper
          mt="xs"
          mb="xs"
          h={150}
          radius="md"
          p="md"
          sx={{
            backgroundColor: theme.colors.gray[0],
            verticalAlign: "center",
          }}
        >
          <Center h="100%" w="100%">
            <Text color="dimmed" size="lg">
              No appointments from {startString} to {endString}
            </Text>
          </Center>
        </Paper>
      );
    }

    return Array.from(bookingsMap.entries())
      .filter(([key, value]) => value.length > 0)
      .map(([key, value]) => (
        <Paper
          key={key}
          mt="xs"
          mb="xs"
          mih={150}
          mah={300}
          radius="md"
          p="md"
          // if more than 3 appointments, it will display scrollbar at the side
          sx={{
            backgroundColor: theme.colors.gray[0],
            overflowY: "auto",
          }}
        >
          <Text size="lg" fw="500">
            {formatISOLongWithDay(key)}
          </Text>
          <Divider />
          {value.length > 0 &&
            value.map((booking) => (
              <UpcomingAppointmentCard
                booking={booking}
                key={booking.bookingId}
              />
            ))}
        </Paper>
      ));
  };

  return (
    <>
      <Group mt="xs">
        <IconCalendarEvent color={theme.colors.indigo[5]} size="1.5rem" />
        <Text size="xl" fw="600" ml={-5}>
          Upcoming Appointments ({startString} - {endString})
        </Text>
        <Button
          size="sm"
          compact
          onClick={() => router.push("/business/appointments")}
        >
          View all
        </Button>
      </Group>
      {renderContent()}
    </>
  );
};

export default PBUpcomingAppointments;
