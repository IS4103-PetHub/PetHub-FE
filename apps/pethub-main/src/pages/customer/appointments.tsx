import {
  Container,
  SegmentedControl,
  useMantineTheme,
  Text,
  Group,
  Box,
  Button,
  ActionIcon,
  Stack,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCalendar, IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import TimeslotCard from "@/components/appointment-booking/TimeslotCard";
import { useGetBookingsByUserId } from "@/hooks/booking";
import { Booking } from "@/types/types";

interface AppointmentsProps {
  userId: number;
}

export default function Appointments({ userId }: AppointmentsProps) {
  const theme = useMantineTheme();
  const [segmentedControlValue, setSegmentedControlValue] = useState("30");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    dayjs(new Date()).add(30, "days").toDate(),
  );

  // set the number of days ahead to display upcoming appointments for
  const segmentedControlData = [
    { label: "1 month", value: "30" },
    { label: "3 months", value: "90" },
    { label: "6 months", value: "180" },
    { label: "Custom", value: "custom" },
  ];

  const { data: bookings = [], isLoading } = useGetBookingsByUserId(
    userId,
    startDate?.toISOString(),
    endDate?.toISOString(),
  );

  //   useEffect(() => console.log(`${startDate} ${endDate}`), [startDate, endDate]);
  //   useEffect(() => console.log(bookings), [bookings]);

  // initialise the start date and end date
  //   useEffect(() => {
  //     const start = new Date();
  //     setStartDate(start);
  //     setEndDate(
  //       dayjs(start).add(parseInt(segmentedControlValue), "days").toDate()
  //     );
  //   }, []);

  function handleChangeSegmentedControl(value) {
    if (value === "custom") {
      setStartDate(null);
      setEndDate(null);
    } else {
      const start = new Date();
      setStartDate(start);
      setEndDate(dayjs(start).add(value, "days").toDate());
    }
    setSegmentedControlValue(value);
  }

  const appointmentCards = bookings.map((booking) => (
    <TimeslotCard
      key={booking.bookingId}
      serviceListing={booking.serviceListing}
      startTime={booking.startTime}
      endTime={booking.endTime}
    />
  ));

  return (
    <>
      <Head>
        <title>My Appointments - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50}>
        <PageTitle title="My appointments" mb="lg" />

        <Group position="apart" align="flex-end">
          <Box>
            <Text weight={500} size="sm">
              Time period
            </Text>
            <SegmentedControl
              value={segmentedControlValue}
              onChange={(value) => handleChangeSegmentedControl(value)}
              data={segmentedControlData}
            />
          </Box>

          <Group
            position="right"
            align="flex-end"
            display={segmentedControlValue === "custom" ? "display" : "none"}
          >
            <DateInput
              label="Start date"
              placeholder="Select start date"
              valueFormat="DD/MM/YYYY"
              icon={<IconCalendar size="1rem" />}
              value={startDate}
              onChange={setStartDate}
            />
            <DateInput
              label="End date"
              placeholder="Select end date"
              valueFormat="DD/MM/YYYY"
              icon={<IconCalendar size="1rem" />}
              value={endDate}
              onChange={setEndDate}
            />
            {/* <ActionIcon
                color={theme.primaryColor}
                variant="filled"
                size="lg"
                mb={2}
              >
                <IconSearch size="1.125rem" />
              </ActionIcon> */}
          </Group>
        </Group>

        <Stack>{appointmentCards}</Stack>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return { props: {} };
  const userId = session.user["userId"];

  return { props: { userId } };
}
