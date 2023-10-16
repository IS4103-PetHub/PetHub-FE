import {
  useMantineTheme,
  Text,
  Divider,
  Card,
  Button,
  Group,
  Box,
  Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMapPin } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import {
  ServiceListing,
  convertMinsToDurationString,
  formatISODayDateTime,
} from "shared-utils";
import { Booking } from "@/types/types";
import SelectTimeslotModal from "./SelectTimeslotModal";

interface TimeslotCardProps {
  serviceListing: ServiceListing;
  startTime: string;
  // optional as endTime can be computed
  endTime?: string;
  // optional, only for updating appointment
  disabled?: boolean;
  booking?: Booking;
  onUpdateBooking?(): void;
}

const TimeslotCard = ({
  serviceListing,
  startTime,
  endTime,
  disabled,
  booking,
  onUpdateBooking,
}: TimeslotCardProps) => {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);

  const isPastAppointment = dayjs(startTime).isBefore(new Date());
  const appointmentTextColor = isPastAppointment ? "dimmed" : "";

  function getTimeDifferenceString() {
    const now = new Date();
    if (dayjs(startTime).isBefore(now)) {
      return "";
    }
    const diffHours = dayjs(startTime).diff(now, "hours");
    if (diffHours < 1) {
      return "happening soon";
    }
    const diffDays = dayjs(startTime).diff(now, "days");
    if (diffDays < 1) {
      return `in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    }
    return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  }

  return (
    <Card withBorder mb="lg" sx={{ backgroundColor: theme.colors.gray[0] }}>
      <Group position="apart">
        <Box>
          {!disabled && (
            <Badge
              mb={5}
              variant={isPastAppointment ? "light" : "dot"}
              color={isPastAppointment ? "dark" : ""}
            >
              {isPastAppointment ? "completed" : getTimeDifferenceString()}
            </Badge>
          )}
          <Text size="lg" weight={600} color={appointmentTextColor}>
            {serviceListing.title}
          </Text>
          {disabled ? (
            <Text color="dimmed">{serviceListing.petBusiness.companyName}</Text>
          ) : (
            <Link href={`/pet-businesses/${serviceListing.petBusinessId}`}>
              <Group>
                <IconMapPin
                  size="1.25rem"
                  color={isPastAppointment ? "gray" : theme.colors.indigo[5]}
                />
                <Text
                  ml={-10}
                  color={isPastAppointment ? "dimmed" : theme.primaryColor}
                  weight={500}
                  sx={{ "&:hover": { fontWeight: 600 } }}
                >
                  {serviceListing.petBusiness.companyName}
                </Text>
              </Group>
            </Link>
          )}
        </Box>

        {!disabled && isPastAppointment && (
          <>
            <Button onClick={open}>Reschedule</Button>
            <SelectTimeslotModal
              serviceListing={serviceListing}
              opened={opened}
              onClose={close}
              isUpdating
              booking={booking}
              onUpdateBooking={onUpdateBooking}
              petOwnerId={booking.petOwnerId}
            />
          </>
        )}
      </Group>
      {serviceListing.addresses?.length > 0 && (
        <Text color="dimmed" size="sm">
          {serviceListing.addresses.map((address) => (
            <div key={address.addressId} style={{ display: "inline" }}>
              {serviceListing.addresses.indexOf(address) > 0 ? ", " : ""}
              {address.addressName}
            </div>
          ))}
        </Text>
      )}
      <Divider mt="xs" mb="xs" />
      {!disabled && booking && booking.pet && (
        <Text color={appointmentTextColor}>
          <strong>Pet: </strong> {booking.pet?.petName}
        </Text>
      )}
      <Text color={appointmentTextColor}>
        <strong>Duration: </strong>
        {convertMinsToDurationString(serviceListing.duration)}
      </Text>
      <Text color={appointmentTextColor}>
        <strong>Start: </strong>
        {formatISODayDateTime(startTime)}
      </Text>
      <Text color={appointmentTextColor}>
        <strong>End: </strong>
        {endTime
          ? formatISODayDateTime(endTime)
          : formatISODayDateTime(
              dayjs(startTime)
                .add(serviceListing.duration, "minutes")
                .toISOString(),
            )}
      </Text>
    </Card>
  );
};

export default TimeslotCard;
