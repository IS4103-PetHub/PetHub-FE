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
  useMantineTheme,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useMediaQuery, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconChevronLeft, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  ServiceListing,
  convertMinsToDurationString,
  formatISODayDateTime,
  formatISOLongWithDay,
  formatISOTimeOnly,
} from "shared-utils";
import { useCreateBooking } from "@/hooks/booking";
import { useGetAvailableTimeSlotsByCGId } from "@/hooks/calendar-group";
import TimeslotCard from "./TimeslotCard";

const CALENDAR_SPAN = 4;
const TIMESLOTS_SPAN = 12 - CALENDAR_SPAN;

interface SelectTimeslotModalProps {
  serviceListing: ServiceListing;
  opened: boolean;
  onClose(): void;
}

const SelectTimeslotModal = ({
  serviceListing,
  opened,
  onClose,
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
      dayjs(selectedMonth).subtract(1, "month").toISOString(),
      dayjs(selectedMonth).add(1, "month").toISOString(),
      serviceListing.duration,
    );

  const createBookingMutation = useCreateBooking();
  async function createBooking() {
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
      const payload = {
        petOwnerId: session.user["userId"],
        calendarGroupId: serviceListing.calendarGroupId,
        serviceListingId: serviceListing.serviceListingId,
        startTime: selectedTimeslot,
        endTime: dayjs(selectedTimeslot)
          .add(serviceListing.duration, "minutes")
          .toISOString(),
      };
      await createBookingMutation.mutateAsync(payload);
      notifications.show({
        title: "Appointment Confirmed",
        color: "green",
        icon: <IconCheck />,
        message: `Your appointment on ${formatISODayDateTime(
          selectedTimeslot,
        )} has been confirmed!`,
      });
    } catch (error: any) {
      notifications.show({
        title: "Error Creating Appointment",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
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
    createBooking();
    handleClose();
  }

  const calendar = (
    <Calendar
      ml="md"
      size="lg"
      maxLevel="year"
      minDate={new Date()}
      excludeDate={(date) =>
        !availTimeslots.some((data) =>
          dayjs(data.startTime).isSame(date, "day"),
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

  const timeslotCards = availTimeslots
    .filter((data) => dayjs(data.startTime).isSame(selectedDate, "day"))
    .map((data) => (
      <Chip
        variant="filled"
        radius="xs"
        size="xl"
        value={data.startTime}
        key={data.timeSlotId}
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
          // display loader if still fetching avail timeslots
          <Box h={200} sx={{ verticalAlign: "center" }}>
            <Center h="100%" w="100%">
              <Loader />
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
                {timeslotCards?.length}
              </Badge>
            </Group>
            <Group>
              <Chip.Group
                multiple={false}
                value={selectedTimeslot}
                onChange={setSelectedTimeslot}
              >
                {timeslotCards}
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
        <Button
          size="md"
          variant="light"
          leftIcon={<IconChevronLeft size="1.25rem" />}
          display={showConfirmation ? "inline" : "none"}
          onClick={() => setShowConfirmation(false)}
        >
          Back
        </Button>
        <Group position="right">
          {selectedTimeslot && !showConfirmation ? (
            <Text>
              <strong>Selected: </strong>
              {formatISODayDateTime(selectedTimeslot)}
            </Text>
          ) : null}
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
