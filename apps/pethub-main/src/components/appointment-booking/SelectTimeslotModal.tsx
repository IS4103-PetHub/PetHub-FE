import {
  Badge,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Group,
  Modal,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  ServiceListing,
  convertMinsToDurationString,
  formatISODateStringLongWithDay,
  formatISODateStringTimeOnly,
} from "shared-utils";
import { useGetAvailableTimeSlotsByCGId } from "@/hooks/calendar-group";
import { TimeSlot } from "@/types/types";

const CALENDAR_SPAN = 4;
const TIMESLOTS_SPAN = 12 - CALENDAR_SPAN;

interface SelectTimeSlotModalProps {
  serviceListing: ServiceListing;
  opened: boolean;
  onClose(): void;
}

// const mockData: TimeSlot[] = [
//   {
//     startTime: "2023-09-29T01:00:00.000Z",
//     endTime: "2023-09-29T02:00:00.000Z",
//     vacancies: 1,
//   },
//   {
//     startTime: "2023-09-30T02:00:00.000Z",
//     endTime: "2023-09-30T03:00:00.000Z",
//     vacancies: 1,
//   },
//   {
//     startTime: "2023-09-30T04:00:00.000Z",
//     endTime: "2023-09-30T05:00:00.000Z",
//     vacancies: 1,
//   },
//   {
//     startTime: "2023-09-30T06:00:00.000Z",
//     endTime: "2023-09-30T07:00:00.000Z",
//     vacancies: 1,
//   },
//   {
//     startTime: "2023-09-30T08:00:00.000Z",
//     endTime: "2023-09-30T09:00:00.000Z",
//     vacancies: 1,
//   },
//   {
//     startTime: "2023-09-30T10:00:00.000Z",
//     endTime: "2023-09-30T11:00:00.000Z",
//     vacancies: 1,
//   },
//   {
//     startTime: "2023-10-01T04:00:00.000Z",
//     endTime: "2023-10-01T05:00:00.000Z",
//     vacancies: 3,
//   },
// ];

const SelectTimeSlotModal = ({
  serviceListing,
  opened,
  onClose,
}: SelectTimeSlotModalProps) => {
  // console.log(serviceListing);
  const theme = useMantineTheme();
  const isTablet = useMediaQuery("(max-width: 100em)");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectTimeSlot] = useState<string>();

  const { data: availTimeSlots = [], isLoading } =
    useGetAvailableTimeSlotsByCGId(
      serviceListing.calendarGroupId,
      dayjs(selectedMonth).subtract(1, "month").toISOString(),
      dayjs(selectedMonth).add(1, "month").toISOString(),
      serviceListing.duration,
    );

  useEffect(() => console.log(selectedMonth), [selectedMonth]);

  // useEffect(() => {
  //   if (!selectedDate && availTimeSlots) {
  //     setSelectedDate(new Date(availTimeSlots[0].startTime));
  //   }
  // }, [availTimeSlots]);

  if (!serviceListing.calendarGroupId) {
    return null;
  }

  const timeslotCards = availTimeSlots
    .filter((data) => dayjs(data.startTime).isSame(selectedDate, "day"))
    .map((data) => (
      <>
        <Chip variant="filled" radius="xs" size="xl" value={data.startTime}>
          {formatISODateStringTimeOnly(data.startTime)}
        </Chip>
      </>
    ));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="1.5rem" weight={600}>
          Select timeslot
        </Text>
      }
      size="70vw"
      padding="xl"
      centered
      closeOnClickOutside={false}
    >
      <Grid>
        <Grid.Col span={isTablet ? CALENDAR_SPAN + 1 : CALENDAR_SPAN}>
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
            onPreviousMonth={() =>
              setSelectedMonth(
                dayjs(selectedMonth).subtract(1, "month").toDate(),
              )
            }
            onNextMonth={() =>
              setSelectedMonth(dayjs(selectedMonth).add(1, "month").toDate())
            }
            getDayProps={(date) => ({
              selected: dayjs(date).isSame(selectedDate, "date"),
              onClick: () => setSelectedDate(date),
            })}
          />
        </Grid.Col>
        <Grid.Col span={isTablet ? TIMESLOTS_SPAN - 1 : TIMESLOTS_SPAN}>
          <Text size="xl" weight={600}>
            {formatISODateStringLongWithDay(selectedDate?.toISOString())}
          </Text>
          <Text color="dimmed" mb="xs">
            Duration: {convertMinsToDurationString(serviceListing.duration)}
          </Text>
          <Divider mb="lg" />
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
        </Grid.Col>
      </Grid>
      <Group position="right">
        <Button size="md">Next</Button>
      </Group>
    </Modal>
  );
};

export default SelectTimeSlotModal;
