import {
  useMantineTheme,
  Text,
  Divider,
  Card,
  Button,
  Group,
  Box,
  Badge,
  CopyButton,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCopy, IconMapPin } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import {
  OrderItem,
  OrderItemStatusEnum,
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
  orderItem: OrderItem;
  // optional, only for updating appointment
  disabled?: boolean;
  booking?: Booking;
  onUpdateBooking?(): void;
  // Make everything viewable on a smol screen
  smallify?: boolean;
  // hide buttons
  viewOnly?: boolean;
}

const TimeslotCard = ({
  serviceListing,
  startTime,
  endTime,
  disabled,
  orderItem,
  booking,
  onUpdateBooking,
  smallify,
  viewOnly,
}: TimeslotCardProps) => {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);

  const isPastAppointment =
    dayjs(startTime).isBefore(new Date()) ||
    orderItem.status !== OrderItemStatusEnum.PendingFulfillment;
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
    <Card
      withBorder
      mb="lg"
      sx={{
        backgroundColor: theme.colors.gray[0],
        fontSize: smallify ? "55%" : "100%",
      }}
    >
      <Group position="apart">
        <Box>
          {!disabled && (
            <Badge
              mb={5}
              size={smallify && "xs"}
              variant={isPastAppointment ? "light" : "dot"}
              color={isPastAppointment ? "dark" : ""}
            >
              {isPastAppointment ? "completed" : getTimeDifferenceString()}
            </Badge>
          )}
          <Text
            size={smallify ? "xs" : "lg"}
            weight={600}
            color={appointmentTextColor}
          >
            {serviceListing.title}
          </Text>
          {disabled ? (
            <Text color="dimmed">{serviceListing.petBusiness.companyName}</Text>
          ) : (
            <Link href={`/pet-businesses/${serviceListing.petBusinessId}`}>
              <Group>
                <IconMapPin
                  size={smallify ? "0.75rem" : "1.25rem"}
                  color={isPastAppointment ? "gray" : theme.colors.indigo[5]}
                />
                <Text
                  ml={-10}
                  color={isPastAppointment ? "dimmed" : theme.primaryColor}
                  weight={500}
                  size={smallify && 10}
                  sx={{ "&:hover": { fontWeight: 600 } }}
                >
                  {serviceListing.petBusiness.companyName}
                </Text>
              </Group>
            </Link>
          )}
        </Box>

        {!disabled && !isPastAppointment && !viewOnly && (
          <>
            <Stack sx={{ display: "flex", alignItems: "flex-end" }} w="45%">
              <Button
                onClick={open}
                w="65%"
                size={smallify ? "xs" : "sm"}
                maw={200}
                mb={-7}
              >
                Reschedule
              </Button>
              <CopyButton value={booking.OrderItem?.voucherCode} timeout={3000}>
                {({ copied, copy }) => (
                  <Button
                    maw={200}
                    color={copied ? "green" : null}
                    w="65%"
                    onClick={copy}
                    variant="light"
                    sx={{
                      border: "1px solid #e0e0e0",
                      backgroundColor: "white",
                    }}
                    leftIcon={<IconCopy size="1rem" />}
                  >
                    {copied ? "Copied" : `${booking.OrderItem?.voucherCode}`}
                  </Button>
                )}
              </CopyButton>
            </Stack>

            <SelectTimeslotModal
              orderItem={orderItem}
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
        <Text color="dimmed" size={smallify ? 8 : "sm"}>
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
