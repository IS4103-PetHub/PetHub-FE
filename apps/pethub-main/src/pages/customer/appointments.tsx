import {
  Container,
  SegmentedControl,
  Text,
  Group,
  Box,
  Stack,
  Transition,
  Center,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useToggle } from "@mantine/hooks";
import { IconCalendar } from "@tabler/icons-react";
import dayjs from "dayjs";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { EMPTY_STATE_DELAY_MS } from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SortBySelect from "web-ui/shared/SortBySelect";
import TimeslotCard from "@/components/appointment-booking/TimeslotCard";
import { useGetBookingsByUserId } from "@/hooks/booking";
import { bookingsSortOptions } from "@/types/constants";
import { Booking } from "@/types/types";
import { sortRecords } from "@/util";

interface AppointmentsProps {
  userId: number;
  memberSince: string;
}

export default function Appointments({
  userId,
  memberSince,
}: AppointmentsProps) {
  const [segmentedControlValue, setSegmentedControlValue] = useState("30");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    dayjs(new Date()).add(30, "days").toDate(),
  );
  const [sortStatus, setSortStatus] = useState<string>("earliest");
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();

  // set the time period e.g. number of days ahead to display appointments for
  const segmentedControlData = [
    { label: "1 month", value: "30" },
    { label: "3 months", value: "90" },
    { label: "6 months", value: "180" },
    { label: "Past", value: "past" },
    { label: "Custom", value: "custom" },
  ];

  const {
    data: bookings = [],
    isLoading,
    refetch: refetchUserBookings,
  } = useGetBookingsByUserId(
    userId,
    startDate?.toISOString(),
    // make the end date inclusive
    endDate ? dayjs(endDate).add(1, "day").toISOString() : null,
  );

  const [records, setRecords] = useState<Booking[]>(bookings);

  useEffect(() => {
    // handle sort
    const newRecords = sortRecords(bookingsSortOptions, bookings, sortStatus);
    setRecords(newRecords);
  }, [bookings, sortStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (bookings.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function handleChangeSegmentedControl(value) {
    const now = new Date();
    if (value === "custom") {
      setStartDate(null);
      setEndDate(null);
    } else if (value === "past") {
      setStartDate(new Date(memberSince));
      setEndDate(now);
    } else {
      setStartDate(now);
      setEndDate(dayjs(now).add(value, "days").toDate());
    }
    setSegmentedControlValue(value);
  }

  const handleReschedule = () => {};

  const appointmentCards = records.map((booking) => (
    <TimeslotCard
      key={booking.bookingId}
      serviceListing={booking.serviceListing}
      startTime={booking.startTime}
      endTime={booking.endTime}
      booking={booking}
      onUpdateBooking={refetchUserBookings}
    />
  ));

  const renderContent = () => {
    if (bookings.length === 0) {
      if (!startDate || !endDate) {
        // no start date and end date selected
        return (
          <Center className="center-vertically" mt={-100}>
            <Text size="xl" weight={500} color="dimmed" align="center">
              Select start and end date
            </Text>
          </Center>
        );
      }
      if (isLoading) {
        return <CenterLoader mt={0} />;
      }
      // no records fetched
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <div style={styles}>
              <SadDimmedMessage
                title="No bookings found"
                subtitle="We cannot find any bookings for the selected time period."
              />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <Stack mt="xl" spacing="xs">
        {appointmentCards}
      </Stack>
    );
  };

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
        </Group>
        {renderContent()}
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return { props: {} };
  const userId = session.user["userId"];
  const memberSince = session.user["dateCreated"];

  return { props: { userId, memberSince } };
}
