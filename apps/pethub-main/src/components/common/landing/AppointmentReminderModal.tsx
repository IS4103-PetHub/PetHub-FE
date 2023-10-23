import { Button, Checkbox, Group, Modal, Text } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import React, { useEffect, useState } from "react";
import { OrderItemStatusEnum } from "shared-utils";
import api from "@/api/axiosConfig";
import TimeslotCard from "@/components/appointment-booking/TimeslotCard";
import { Booking } from "@/types/types";

interface AppointmentReminderModalProps {
  opened: boolean;
  close(): void;
}

const DAYS_AHEAD = 3;
const HIDE_DURATION_HOURS = 24;

const AppointmentReminderModal = ({
  opened,
  close,
}: AppointmentReminderModalProps) => {
  const [isLoading, setIsLoading] = useToggle();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const router = useRouter();
  const cookies = parseCookies();

  // Set client cookie
  const handleClickDontShow = (value: boolean) => {
    if (!value) {
      destroyCookie(null, "hideReminder");
      return;
    }
    setCookie(null, "hideReminder", "true", {
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
  };

  const getUpcomingAppointments = async () => {
    // fetch appointments in the coming days
    setIsLoading(true);
    const session = await getSession();
    if (!session) {
      return;
    }
    const userId = session.user["userId"];

    const startTime = new Date().toISOString();
    const endTime = dayjs(startTime)
      .add(DAYS_AHEAD, "day")
      .startOf("day")
      .toISOString();
    const params = { startTime, endTime };
    const response = await api.get(`/bookings/users/${userId}`, {
      params,
    });
    return response.data as Booking[];
  };

  useEffect(() => {
    getUpcomingAppointments().then((data) => {
      const upcomingNotCompleted = data
        ?.filter(
          (booking) =>
            booking.OrderItem.status === OrderItemStatusEnum.PendingFulfillment,
        )
        .sort((a, b) => (dayjs(a.startTime).isAfter(b.startTime) ? 1 : -1));
      setBookings(upcomingNotCompleted);
      setIsLoading(false);
    });
  }, []);

  if (
    isLoading ||
    !bookings ||
    bookings.length === 0 ||
    cookies["hideReminder"] === "true"
  ) {
    return null;
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      size="lg"
      title={
        <Text fw={500} size="lg">
          Appointment Reminder
        </Text>
      }
    >
      <Text>
        Greetings pet pal! This is a friendly reminder that you have{" "}
        <strong>{bookings.length}</strong> upcoming appointment
        {bookings.length > 1 ? "s" : ""} in the next {DAYS_AHEAD} days. Thank
        you for trusting PetHub to take care of your pets&#39; needs.
      </Text>
      <Text fw={500} mt="sm">
        Next appointment:
      </Text>
      <TimeslotCard
        booking={bookings[0]}
        serviceListing={bookings[0].serviceListing}
        startTime={bookings[0].startTime}
        endTime={bookings[0].endTime}
        orderItem={bookings[0].OrderItem}
        viewOnly
      />
      <Checkbox
        label={`Don't show this again for ${HIDE_DURATION_HOURS} hours`}
        onChange={(event) => handleClickDontShow(event.currentTarget.checked)}
      />
      <Group position="apart" spacing={5}>
        <Button mt="lg" size="md" w="38%" color="gray" onClick={close}>
          Close
        </Button>
        <Button
          mt="lg"
          size="md"
          w="60%"
          color="dark"
          className="gradient-hover"
          onClick={() => router.push("/customer/appointments")}
        >
          View all appointments
        </Button>
      </Group>
    </Modal>
  );
};

export default AppointmentReminderModal;
