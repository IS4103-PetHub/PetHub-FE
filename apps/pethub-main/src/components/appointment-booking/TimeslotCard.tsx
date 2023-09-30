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
import SelectTimeslotModal from "./SelectTimeslotModal";

interface TimeslotCardProps {
  serviceListing: ServiceListing;
  startTime: string;
  // optional as endTime can be computed
  endTime?: string;
  // optional, only for updating appointment
  disabled?: boolean;
  bookingId?: number;
  onUpdateBooking?(): void;
}

const TimeslotCard = ({
  serviceListing,
  startTime,
  endTime,
  disabled,
  bookingId,
  onUpdateBooking,
}: TimeslotCardProps) => {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);

  function getTimeDifferenceString() {
    const now = new Date();
    const diffDays = dayjs(startTime).diff(now, "days");
    if (diffDays < 1) {
      const diffHours = dayjs(startTime).diff(now, "hours");
      return `in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    }
    return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  }

  return (
    <Card withBorder mb="lg" sx={{ backgroundColor: theme.colors.gray[0] }}>
      <Group position="apart">
        <Box>
          {disabled ? null : (
            <Badge mb={5} variant="dot">
              {getTimeDifferenceString()}
            </Badge>
          )}
          <Text size="lg" weight={600}>
            {serviceListing.title}
          </Text>
          {disabled ? (
            <Text color="dimmed">{serviceListing.petBusiness.companyName}</Text>
          ) : (
            <Link href={`/pet-businesses/${serviceListing.petBusinessId}`}>
              <Group>
                <IconMapPin size="1.25rem" color={theme.colors.indigo[6]} />
                <Text
                  ml={-10}
                  color={theme.primaryColor}
                  weight={500}
                  sx={{ "&:hover": { fontWeight: 600 } }}
                >
                  {serviceListing.petBusiness.companyName}
                </Text>
              </Group>
            </Link>
          )}
        </Box>
        {disabled ? null : (
          <>
            <Button onClick={open}>Reschedule</Button>
            <SelectTimeslotModal
              serviceListing={serviceListing}
              opened={opened}
              onClose={close}
              isUpdating
              bookingId={bookingId}
              onUpdateBooking={onUpdateBooking}
            />
          </>
        )}
      </Group>
      <Divider mt="xs" mb="xs" />
      <Text>
        <strong>Duration: </strong>
        {convertMinsToDurationString(serviceListing.duration)}
      </Text>
      <Text>
        <strong>Start: </strong>
        {formatISODayDateTime(startTime)}
      </Text>
      <Text>
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
