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
import dayjs from "dayjs";
import React from "react";
import {
  ServiceListing,
  convertMinsToDurationString,
  formatISODayDateTime,
} from "shared-utils";

interface TimeslotCardProps {
  serviceListing: ServiceListing;
  startTime: string;
  endTime?: string;
  disabled?: boolean;
}

const TimeslotCard = ({
  serviceListing,
  startTime,
  endTime,
}: TimeslotCardProps) => {
  const theme = useMantineTheme();

  function getTimeDifferenceString() {
    const now = new Date();
    const diffDays = dayjs(startTime).diff(now, "days");
    if (diffDays < 2) {
      const diffHours = dayjs(startTime).diff(now, "hours");
      return `in ${diffHours} hours`;
    }
    return `in ${diffDays} days`;
  }

  return (
    <Card withBorder mb="lg" sx={{ backgroundColor: theme.colors.gray[0] }}>
      <Group position="apart">
        <Box>
          <Badge mb={5} variant="dot">
            {getTimeDifferenceString()}
          </Badge>
          <Text size="lg" weight={600}>
            {serviceListing.title}
          </Text>
          <Text color="dimmed">{serviceListing.petBusiness.companyName}</Text>
        </Box>
        <Button>Reschedule</Button>
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
