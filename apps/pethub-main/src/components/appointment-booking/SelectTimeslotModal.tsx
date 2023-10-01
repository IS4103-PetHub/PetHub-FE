import {
  Badge,
  Box,
  Button,
  Center,
  Chip,
  Divider,
  Grid,
  Group,
  Loader,
  Modal,
  Text,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useMediaQuery, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconChevronLeft } from "@tabler/icons-react";
import dayjs from "dayjs";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  ServiceListing,
  convertMinsToDurationString,
  formatISODayDateTime,
  formatISOLongWithDay,
  formatISOTimeOnly,
  getErrorMessageProps,
} from "shared-utils";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import { useCreateBooking, useUpdateBooking } from "@/hooks/booking";
import { useGetAvailableTimeSlotsByCGId } from "@/hooks/calendar-group";
import { Booking } from "@/types/types";
import TimeslotCard from "./TimeslotCard";

const CALENDAR_SPAN = 4;
const TIMESLOTS_SPAN = 12 - CALENDAR_SPAN;

interface SelectTimeslotModalProps {
  serviceListing: ServiceListing;
  opened: boolean;
  onClose(): void;
  // optional, only for updating
  isUpdating?: boolean;
  booking?: Booking;
  onUpdateBooking?(): void;
}

const SelectTimeslotModal = ({
  serviceListing,
  opened,
  onClose,
  isUpdating,
  booking,
  onUpdateBooking,
}: SelectTimeslotModalProps) => {
  const isTablet = useMediaQuery("(max-width: 100em)");
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    dayjs(new Date()).startOf("month").toDate(),
  );
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeslot, setSelectedTimeslot] = useState<string>();
  const [showConfirmation, setShowConfirmation] = useToggle();

  /* 
  service listing does not belong to calendar group, or does not have a set duration
  means this service listing is not applicable for appointment booking
  */
  const notApplicableForAppointment =
    !serviceListing.calendarGroupId || !serviceListing.duration;

  const { data: availTimeslots = [], isLoading } =
    useGetAvailableTimeSlotsByCGId(
      serviceListing.calendarGroupId,
      selectedMonth.toISOString(),
      dayjs(selectedMonth).add(1, "month").toISOString(),
      serviceListing.duration,
    );

  useEffect(() => console.log(availTimeslots), [availTimeslots]);

  const createBookingMutation = useCreateBooking();
  const updateBookingMutation = useUpdateBooking();

  async function createOrUpdateBooking() {
    const session = await getSession();
    if (!session) {
      notifications.show({
        title: "Login Required",
        message: "Please log in to confirm booking!",
        color: "red",
      });
      return;
    }
    try {
      let payload;
      const startTime = selectedTimeslot;
      const endTime = dayjs(selectedTimeslot)
        .add(serviceListing.duration, "minutes")
        .toISOString();

      if (isUpdating) {
        payload = { bookingId: booking.bookingId, startTime, endTime };
        await updateBookingMutation.mutateAsync(payload);
        // refetch user bookings
        onUpdateBooking();
      } else {
        payload = {
          petOwnerId: session.user["userId"],
          calendarGroupId: serviceListing.calendarGroupId,
          serviceListingId: serviceListing.serviceListingId,
          startTime,
          endTime,
        };
        await createBookingMutation.mutateAsync(payload);
      }
      notifications.show({
        title: `Appointment ${isUpdating ? "Rescheduled" : "Confirmed"}`,
        color: "green",
        icon: <IconCheck />,
        message: `Your appointment on ${formatISODayDateTime(
          selectedTimeslot,
        )} has been confirmed!`,
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(
          `Error ${isUpdating ? "Updating" : "Creating"} Appointment`,
          error,
        ),
      });
    }
  }

  if (notApplicableForAppointment) {
    return null;
  }

  function handleClose() {
    onClose();
    setSelectedMonth(dayjs(new Date()).startOf("month").toDate());
    setSelectedTimeslot(null);
    setSelectedDate(null);
    setShowConfirmation(false);
  }

  function handleClickButton() {
    if (!showConfirmation) {
      setShowConfirmation();
      return;
    }
    createOrUpdateBooking();
    handleClose();
  }

  const calendar = (
    <Calendar
      ml="md"
      size="lg"
      maxLevel="year"
      minDate={new Date()}
      // exclude dates without any available time slots that is later than the system time
      excludeDate={(date) =>
        !availTimeslots.some(
          (data) =>
            dayjs(data.startTime).isSame(date, "day") &&
            dayjs(data.startTime).isAfter(new Date()),
        )
      }
      onMonthSelect={(month) => setSelectedMonth(month)}
      onPreviousMonth={() => {
        setSelectedMonth(dayjs(selectedMonth).subtract(1, "month").toDate());
        setSelectedDate(null);
      }}
      onNextMonth={() => {
        setSelectedMonth(dayjs(selectedMonth).add(1, "month").toDate());
        setSelectedDate(null);
      }}
      getDayProps={(date) => ({
        selected: dayjs(date).isSame(selectedDate, "date"),
        onClick: () => setSelectedDate(date),
      })}
    />
  );

  const timeslotChips = availTimeslots
    .filter((data) => dayjs(data.startTime).isSame(selectedDate, "day"))
    .map((data) => (
      <Chip
        variant="filled"
        radius="xs"
        size="xl"
        value={data.startTime}
        key={data.startTime}
        disabled={booking ? booking.startTime === data.startTime : false}
      >
        {formatISOTimeOnly(data.startTime)}
      </Chip>
    ));

  const selectTimeslotsGrid = (
    <Grid>
      <Grid.Col span={isTablet ? CALENDAR_SPAN + 1 : CALENDAR_SPAN}>
        {calendar}
      </Grid.Col>
      <Grid.Col span={isTablet ? TIMESLOTS_SPAN - 1 : TIMESLOTS_SPAN}>
        <Text size="xl" weight={600}>
          {selectedDate
            ? formatISOLongWithDay(selectedDate.toISOString())
            : "Select a date to view"}
        </Text>
        <Text color="dimmed" mb="xs">
          Duration: {convertMinsToDurationString(serviceListing.duration)}
        </Text>
        <Divider mb="lg" />

        {isLoading ? (
          <Box h={200} sx={{ verticalAlign: "center" }}>
            <Center h="100%" w="100%">
              <Loader opacity={0.5} />
            </Center>
          </Box>
        ) : null}

        {selectedDate ? (
          <>
            <Group mb="md">
              <Text size="lg" weight={500}>
                Available start times
              </Text>
              <Badge variant="dot" size="lg" radius="xl" ml={-5}>
                {timeslotChips?.length}
              </Badge>
            </Group>
            <Group>
              <Chip.Group
                multiple={false}
                value={selectedTimeslot}
                onChange={setSelectedTimeslot}
              >
                {timeslotChips}
              </Chip.Group>
            </Group>
          </>
        ) : null}
      </Grid.Col>
    </Grid>
  );

  const confirmation = (
    <>
      <Text mb="lg">Please check and confirm your selected timeslot.</Text>
      <TimeslotCard
        serviceListing={serviceListing}
        startTime={selectedTimeslot}
        disabled
      />
    </>
  );

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Text size="1.5rem" weight={600}>
          {showConfirmation ? "Confirm timeslot" : "Select timeslot"}
        </Text>
      }
      size="70vw"
      padding="xl"
      centered
      closeOnClickOutside={false}
    >
      {showConfirmation ? confirmation : selectTimeslotsGrid}

      <Group position={showConfirmation ? "apart" : "right"}>
        <LargeBackButton
          text="Back"
          variant="light"
          display={showConfirmation ? "inline" : "none"}
          onClick={() => setShowConfirmation(false)}
        />
        <Group position="right">
          {selectedTimeslot && !showConfirmation ? (
            <Text>
              <strong>Selected: </strong>
              {formatISODayDateTime(selectedTimeslot)}
            </Text>
          ) : null}
          <Button
            size="md"
            color="gray"
            variant="default"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            size="md"
            disabled={!selectedTimeslot}
            onClick={handleClickButton}
          >
            {showConfirmation ? "Confirm" : "Next"}
          </Button>
        </Group>
      </Group>
    </Modal>
  );
};

export default SelectTimeslotModal;
