import {
  Box,
  Button,
  Card,
  Grid,
  Group,
  Image,
  SegmentedControl,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { IconCalendar } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";
import { formatISODateOnly, formatISODateTimeShort } from "shared-utils";
import CenterLoader from "web-ui/shared/CenterLoader";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import { useGetBookingsByUserId } from "@/hooks/booking";

interface SelectAppointmentProps {
  form: UseFormReturnType<any>;
  userId: number;
  memberSince: string;
}

export default function SelectAppointment({
  form,
  userId,
  memberSince,
}: SelectAppointmentProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    dayjs(new Date()).add(30, "days").toDate(),
  );
  const [segmentedControlValue, setSegmentedControlValue] = useState("30");
  const [visibleRows, setVisibleRows] = useState<number>(2);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  );
  const segmentedControlData = [
    { label: "1 month", value: "30" },
    { label: "3 months", value: "90" },
    { label: "Past", value: "past" },
    { label: "Custom", value: "custom" },
  ];

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

  const {
    data: bookings = [],
    isLoading,
    refetch: refetchUserBookings,
  } = useGetBookingsByUserId(
    userId,
    startDate?.toISOString(),
    endDate ? dayjs(endDate).toISOString() : null,
  );

  const visibleListings = bookings.slice(0, visibleRows * 3);

  const handleShowMore = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 2);
  };

  const handleShowLess = () => {
    setVisibleRows((prevVisibleRows) =>
      prevVisibleRows > 4 ? prevVisibleRows - 2 : 2,
    );
  };

  const handleRowClick = (bookingId: number) => {
    form.setValues({
      ...form.values,
      bookingId: bookingId,
    });
    setSelectedBookingId(bookingId); // Set the selected serviceListingId in the state
  };

  const bookingsCards = visibleListings.map((bookings) => (
    <Grid.Col span={6} key={bookings.bookingId}>
      <Card
        radius="md"
        withBorder
        onClick={() => handleRowClick(bookings.bookingId)}
        style={{
          backgroundColor:
            selectedBookingId === bookings.bookingId ? "#f0f0f0" : "white",
        }}
      >
        <Group>
          <Box>
            <Image
              src={
                bookings.serviceListing.attachmentURLs.length > 0
                  ? bookings.serviceListing.attachmentURLs[0]
                  : "/pethub-placeholder.png"
              }
              height={70}
              width={70}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Text
              weight={600}
              size="sm"
              sx={{ lineHeight: 1.4, wordWrap: "break-word" }}
            >
              {bookings.OrderItem.itemName} ID: {bookings.bookingId}
            </Text>
            <Text size="xs" color="dimmed">
              Start: {formatISODateTimeShort(bookings.startTime)}
            </Text>
            <Text size="xs" color="dimmed">
              End: {formatISODateTimeShort(bookings.endTime)}
            </Text>
          </Box>
        </Group>
      </Card>
    </Grid.Col>
  ));

  const renderContent = () => {
    if (bookings.length === 0) {
      if (isLoading) {
        return <CenterLoader />;
      }
      return <SadDimmedMessage title="No Bookings found" subtitle="" />;
    }

    return <>{bookingsCards}</>;
  };

  return (
    <>
      <Grid>
        <Grid.Col span={12}>
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
            mt="xs"
            display={segmentedControlValue === "custom" ? "display" : "none"}
          >
            <DateInput
              label="Start date (inclusive)"
              placeholder="Select start date"
              valueFormat="DD-MM-YYYY"
              icon={<IconCalendar size="1rem" />}
              value={startDate}
              onChange={setStartDate}
              error={
                startDate > endDate && "Start date cannot be after end date."
              }
            />
            <DateInput
              label="End date (exclusive)"
              placeholder="Select end date"
              valueFormat="DD-MM-YYYY"
              icon={<IconCalendar size="1rem" />}
              value={endDate}
              onChange={setEndDate}
              error={
                endDate < startDate && "End date cannot be before start date."
              }
            />
          </Group>
        </Grid.Col>
        {renderContent()}
      </Grid>
      <Box mt="xl">
        {visibleListings.length < bookings.length && (
          <Button onClick={handleShowMore} style={{ marginRight: 8 }}>
            Show More Items
          </Button>
        )}
        {visibleRows > 2 && <Button onClick={handleShowLess}>Show Less</Button>}
      </Box>
    </>
  );
}
