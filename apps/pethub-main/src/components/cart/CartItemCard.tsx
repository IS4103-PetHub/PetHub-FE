import {
  useMantineTheme,
  Text,
  Divider,
  Card,
  Button,
  Group,
  Box,
  Badge,
  Checkbox,
  Grid,
  Image,
  Stack,
  Center,
  Alert,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMapPin } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  ServiceListing,
  convertMinsToDurationString,
  formatISODayDateTime,
} from "shared-utils";
import NumberInputWithIcons from "web-ui/shared/NumberInputWithIcons";
import { useGetAvailableTimeSlotsByCGId } from "@/hooks/calendar-group";
import { Booking, CartItemBookingSelection } from "@/types/types";
import { formatPriceForDisplay } from "@/util";
import ServiceListingTags from "../service-listing-discovery/ServiceListingTags";
import CartItemBadge from "./CartItemBadge";

interface CartItemCardProps {
  itemId: number;
  serviceListing: ServiceListing;
  bookingSelection: CartItemBookingSelection;
  checked: boolean;
  onCheckedChange: (checked: any) => void;
  setItemQuantity: (cartItemId: number, quantity: number) => void;
  quantity?: number;
}

const CartItemCard = ({
  itemId,
  serviceListing,
  bookingSelection,
  checked,
  onCheckedChange,
  setItemQuantity,
  quantity,
}: CartItemCardProps) => {
  const theme = useMantineTheme();
  const [value, setValue] = useState<number | "">(quantity || 1);

  // Always call the hook, but the hook should not run if any of these are null due to the enabled property
  const shouldFetch = bookingSelection && serviceListing.calendarGroupId;
  const { data: availTimeslots = [], isLoading } =
    useGetAvailableTimeSlotsByCGId(
      shouldFetch ? serviceListing.calendarGroupId : null,
      shouldFetch ? bookingSelection.startTime : null,
      shouldFetch ? bookingSelection.endTime : null,
      shouldFetch ? serviceListing.duration : null,
    );

  useEffect(() => {
    setValue(quantity || 1);
  }, [quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    setValue(newQuantity);
    setItemQuantity(itemId, newQuantity);
  };

  console.log("SLID", serviceListing.serviceListingId);
  console.log("PETID", bookingSelection?.petId);
  console.log("Start", bookingSelection?.startTime);
  console.log("End", bookingSelection?.endTime);
  console.log("availTimeslots", availTimeslots);

  return (
    <Card
      withBorder
      mb="lg"
      mah={220}
      mih={220}
      sx={{ backgroundColor: theme.colors.gray[0] }}
      radius="lg"
    >
      <Group position="apart" mb="xs">
        <Center>
          <Checkbox
            color="cyan"
            mr="md"
            checked={checked}
            onChange={(event) => onCheckedChange(event.currentTarget.checked)}
          />
          <CartItemBadge
            text={`Duration: ${serviceListing.duration} minutes`}
            type="DURATION"
          />
        </Center>
        <Box>
          {!serviceListing.calendarGroupId && (
            <CartItemBadge
              text={`Unit price: $${formatPriceForDisplay(
                serviceListing.basePrice,
              )}`}
              type="UNITPRICE"
              variant="dot"
              square={true}
            />
          )}
          &nbsp;
          <CartItemBadge
            text={`Item total: $${formatPriceForDisplay(
              quantity
                ? serviceListing.basePrice * quantity
                : serviceListing.basePrice,
            )}`}
            type="TOTALPRICE"
            variant="dot"
            square={true}
          />
        </Box>
      </Group>
      <Divider mt={1} mb="xs" />
      <Grid>
        <Grid.Col span={2} mr={5}>
          {serviceListing?.attachmentURLs?.length > 0 ? (
            <Image
              radius="md"
              src={serviceListing.attachmentURLs[0]}
              fit="contain"
              w="auto"
              alt="Cart Item Photo"
            />
          ) : (
            <Image
              radius="md"
              src="/pethub-placeholder.png"
              fit="contain"
              w="auto"
              alt="Cart Item Photo"
            />
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          <Box>
            <Text fw={600} size={18}>
              {serviceListing.title}
            </Text>
            <CartItemBadge
              text={serviceListing.petBusiness?.companyName}
              type="PETBUSINESS"
              variant="gradient"
              square={true}
              size="md"
              mb="xs"
            />
            <ServiceListingTags tags={serviceListing.tags} />
            <Text size={12} mt="xs">
              {serviceListing.description.length > 200
                ? serviceListing.description.substring(0, 200) + "..."
                : serviceListing.description}
            </Text>
          </Box>
        </Grid.Col>
        <Grid.Col span={3} ml={65}>
          <Group position="right">
            {!serviceListing.calendarGroupId ? (
              <NumberInputWithIcons
                value={value}
                setValue={handleQuantityChange}
                min={0}
                max={20}
                step={1}
              />
            ) : availTimeslots.length > 0 ? (
              <Alert
                variant="outline"
                color="cyan"
                title="Booking selection"
                radius="md"
                mih={140}
                mah={140}
                miw={230}
                maw={230}
              >
                <Text size="xs">
                  <b>Start:</b>{" "}
                  {formatISODayDateTime(bookingSelection?.startTime)}
                </Text>
                <Text size="xs">
                  <b>End:</b> {formatISODayDateTime(bookingSelection?.endTime)}
                </Text>
                {bookingSelection?.petName && (
                  <Text size="xs">
                    <b>Pet:</b> {bookingSelection?.petName}
                  </Text>
                )}
              </Alert>
            ) : (
              <>Your selected timeslot is no longer available</>
            )}
          </Group>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default CartItemCard;
