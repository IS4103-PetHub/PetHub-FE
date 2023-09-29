import {
  Container,
  SegmentedControl,
  useMantineTheme,
  Text,
  Group,
  Box,
  Stack,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCalendar, IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import SortBySelect from "web-ui/shared/SortBySelect";
import TimeslotCard from "@/components/appointment-booking/TimeslotCard";
import { useGetBookingsByUserId } from "@/hooks/booking";
import { bookingsSortOptions } from "@/types/constants";
import { Booking } from "@/types/types";
import { sortRecords } from "@/util";

interface AppointmentsProps {
  userId: number;
}

export default function Appointments({ userId }: AppointmentsProps) {
  const [segmentedControlValue, setSegmentedControlValue] = useState("30");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    dayjs(new Date()).add(30, "days").toDate(),
  );
  const [sortStatus, setSortStatus] = useState<string>("upcoming");

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

  const [records, setRecords] = useState<Booking[]>(bookings);

  useEffect(() => {
    // handle sort
    const newRecords = sortRecords(bookingsSortOptions, bookings, sortStatus);
    setRecords(newRecords);
  }, [bookings, sortStatus]);

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

  const appointmentCards = records.map((booking) => (
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
          <SortBySelect
            mb={2}
            size="sm"
            data={bookingsSortOptions}
            value={sortStatus}
            onChange={setSortStatus}
          />
        </Group>

        <Group
          mt="xs"
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
        <Stack mt="xl" spacing="xs">
          {appointmentCards}
        </Stack>
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
