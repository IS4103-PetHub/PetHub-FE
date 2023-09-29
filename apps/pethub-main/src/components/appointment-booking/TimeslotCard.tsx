import { useMantineTheme, Text, Divider, Card } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import {
  ServiceListing,
  convertMinsToDurationString,
  formatISODayDateTime,
} from "shared-utils";

interface TimeslotCardProps {
  serviceListing: ServiceListing;
  selectedTimeslot: string;
}

const TimeslotCard = ({
  serviceListing,
  selectedTimeslot,
}: TimeslotCardProps) => {
  const theme = useMantineTheme();
  return (
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
        {formatISODayDateTime(selectedTimeslot)}
      </Text>
      <Text>
        <strong>End: </strong>
        {formatISODayDateTime(
          dayjs(selectedTimeslot)
            .add(serviceListing.duration, "minutes")
            .toISOString(),
        )}
      </Text>
    </Card>
  );
};

export default TimeslotCard;
