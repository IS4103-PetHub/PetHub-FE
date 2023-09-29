import {
  Badge,
  Box,
  Button,
  Card,
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
import { IconChevronLeft } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  ServiceListing,
  convertMinsToDurationString,
  formatISODayDateTime,
  formatISOLongWithDay,
  formatISOTimeOnly,
} from "shared-utils";
import { useGetAvailableTimeSlotsByCGId } from "@/hooks/calendar-group";

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
  const theme = useMantineTheme();
  const isTablet = useMediaQuery("(max-width: 100em)");
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    dayjs(new Date()).startOf("month").toDate(),
  );
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectTimeSlot] = useState<string>();
  const [showConfirmation, setShowConfirmation] = useToggle();

  const { data: availTimeSlots = [], isLoading } =
    useGetAvailableTimeSlotsByCGId(
      serviceListing.calendarGroupId,
      dayjs(selectedMonth).subtract(1, "month").toISOString(),
      dayjs(selectedMonth).add(1, "month").toISOString(),
      serviceListing.duration,
    );

  if (!serviceListing.calendarGroupId) {
    return null;
  }

  function handleClickButton() {
    if (!showConfirmation) {
      setShowConfirmation();
      return;
    }
  }

  const calendar = (
    <Calendar
      ml="md"
      size="lg"
      maxLevel="year"
      minDate={new Date()}
      excludeDate={(date) =>
        !availTimeSlots.some((data) =>
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

  const timeslotCards = availTimeSlots
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
                value={selectedTimeSlot}
                onChange={setSelectTimeSlot}
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
      <Card withBorder mb="lg" sx={{ backgroundColor: theme.colors.gray[0] }}>
        <Text size="lg" weight={600}>
          {serviceListing.title}
        </Text>
        <Text color="dimmed">{serviceListing.petBusiness.companyName}</Text>
        <Divider mt="xs" mb="xs" />
        <Text>
          <strong>Duration: </strong>
          {convertMinsToDurationString(serviceListing.duration)}
        </Text>
        <Text>
          <strong>Start: </strong>
          {formatISODayDateTime(selectedTimeSlot)}
        </Text>
        <Text>
          <strong>End: </strong>
          {formatISODayDateTime(
            dayjs(selectedTimeSlot)
              .add(serviceListing.duration, "minutes")
              .toISOString(),
          )}
        </Text>
      </Card>
    </>
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
          {selectedTimeSlot && !showConfirmation ? (
            <Text>
              <strong>Selected: </strong>
              {formatISODayDateTime(selectedTimeSlot)}
            </Text>
          ) : null}
          <Button
            size="md"
            disabled={!selectedTimeSlot}
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
