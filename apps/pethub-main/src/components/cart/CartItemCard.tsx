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
import { notifications } from "@mantine/notifications";
import { IconMapPin, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
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
  removeItem: () => void;
  isExpired: boolean;
  setCardExpired: (isExpired: boolean) => void;
  quantity?: number;
}

const CartItemCard = ({
  itemId,
  serviceListing,
  bookingSelection,
  checked,
  onCheckedChange,
  setItemQuantity,
  removeItem,
  quantity,
  isExpired,
  setCardExpired,
}: CartItemCardProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [value, setValue] = useState<number | "">(quantity || 1);
  const hasProcessedCheckboxDisabled = useRef(false); // Track the thing even through re-renders from other state changes

  // Always call the hook, but the hook should not run if any of these are null due to the enabled property
  const shouldFetch = bookingSelection && serviceListing.calendarGroupId;
  const { data: availTimeslots = [], isLoading } =
    useGetAvailableTimeSlotsByCGId(
      shouldFetch ? serviceListing.calendarGroupId : null,
      shouldFetch ? bookingSelection.startTime : null,
      shouldFetch ? bookingSelection.endTime : null,
      shouldFetch ? serviceListing.duration : null,
    );

  const isCheckboxDisabled =
    serviceListing.calendarGroupId && availTimeslots.length === 0
      ? true
      : false;

  useEffect(() => {
    // This ideally should be replaced with timeslot checking in the parent page (cart), but laze coz will have to change a lot of things for this
    if (isCheckboxDisabled && !hasProcessedCheckboxDisabled.current) {
      onCheckedChange(false);
      setCardExpired(true);
      hasProcessedCheckboxDisabled.current = true;
    } else if (!isCheckboxDisabled && hasProcessedCheckboxDisabled.current) {
      onCheckedChange(true);
      setCardExpired(false);
      hasProcessedCheckboxDisabled.current = false;
    }
  }, [isCheckboxDisabled, onCheckedChange]);

  useEffect(() => {
    setValue(quantity || 1);
  }, [quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    setValue(newQuantity);
    setItemQuantity(itemId, newQuantity);
  };

  const removeItemFromCart = () => {
    removeItem();
    notifications.show({
      title: "Item Removed from Cart",
      color: "green",
      message: `${serviceListing.title} has been removed from your cart.`,
    });
  };

  console.log("SLID", serviceListing.serviceListingId);
  console.log("CGID", serviceListing.calendarGroupId);
  console.log("PETID", bookingSelection?.petId);
  console.log("Start", bookingSelection?.startTime);
  console.log("End", bookingSelection?.endTime);
  console.log("availTimeslots", availTimeslots);

  return (
    <Card
      withBorder
      mb="lg"
      mah={270}
      mih={270}
      sx={{
        backgroundColor: isExpired
          ? theme.colors.gray[3]
          : theme.colors.gray[0],
        opacity: isExpired ? 0.7 : 1,
      }}
      radius="lg"
      shadow="sm"
    >
      <Group position="apart" mb="xs">
        <Center>
          <Checkbox
            mr="md"
            checked={
              !serviceListing.calendarGroupId
                ? checked
                : checked && availTimeslots.length > 0
            }
            disabled={isCheckboxDisabled}
            onChange={(event) => onCheckedChange(event.currentTarget.checked)}
          />
          {serviceListing.calendarGroupId && (
            <CartItemBadge
              text={`Duration: ${convertMinsToDurationString(
                serviceListing.duration,
              )}`}
              type="DURATION"
              variant="dot"
              square={true}
            />
          )}
        </Center>
        <Center>
          <Button
            variant="subtle"
            onClick={removeItemFromCart}
            leftIcon={<IconTrash size="1rem" />}
            color="gray"
          >
            Remove from cart
          </Button>
        </Center>
      </Group>
      <Divider mt={1} mb="xs" />
      <Grid
        columns={24}
        sx={{
          height: "100%",
        }}
      >
        <Grid.Col span={4} mt="xs">
          {serviceListing?.attachmentURLs?.length > 0 ? (
            <Image
              radius="md"
              src={serviceListing.attachmentURLs[0]}
              fit="contain"
              w="auto"
              alt="Cart Item Photo"
              sx={{
                filter: isExpired ? "grayscale(100%)" : "none",
              }}
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
        <Grid.Col span={15}>
          <Box>
            <Link
              href={`/service-listings/${serviceListing.serviceListingId}`}
              style={{ textDecoration: "underline" }}
            >
              <Text fw={600} size={18}>
                {serviceListing.title}
              </Text>
            </Link>
            <CartItemBadge
              text={serviceListing.petBusiness?.companyName}
              type="PETBUSINESS"
              variant=""
              square={true}
              size="md"
              mb="xs"
              ml={-10}
            />
            <Text size={12} mb="xs" lineClamp={2}>
              {serviceListing.description}
            </Text>
            <Box>
              {!serviceListing.calendarGroupId ? (
                <NumberInputWithIcons
                  value={value}
                  setValue={handleQuantityChange}
                  min={0}
                  max={20}
                  step={1}
                />
              ) : (
                <Alert
                  variant="light"
                  color={availTimeslots.length > 0 ? "blue" : "red"}
                  title={
                    availTimeslots.length > 0
                      ? "Booking selection"
                      : "Selected time slot unavailable"
                  }
                  radius="md"
                  mih={80}
                  mah={80}
                  miw={475}
                  maw={475}
                >
                  {availTimeslots.length > 0 ? (
                    <Text size="xs">
                      <b>Start:</b>{" "}
                      {formatISODayDateTime(bookingSelection?.startTime)}{" "}
                      &nbsp;&nbsp;
                      <b>End:</b>{" "}
                      {formatISODayDateTime(bookingSelection?.endTime)}{" "}
                      &nbsp;&nbsp;
                      {bookingSelection?.petName && (
                        <>
                          <b>Pet:</b> {bookingSelection?.petName}
                        </>
                      )}
                    </Text>
                  ) : (
                    <Text>
                      Please remove this item and re-attempt time slot
                      selection.
                    </Text>
                  )}
                </Alert>
              )}
            </Box>
          </Box>
        </Grid.Col>
        <Grid.Col
          span={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          {!serviceListing.calendarGroupId && (
            <CartItemBadge
              fullWidth
              text={`Unit $${formatPriceForDisplay(serviceListing.basePrice)}`}
              type="UNITPRICE"
              variant="outline"
              square={true}
              size="lg"
            />
          )}
          <CartItemBadge
            fullWidth
            text={`Total $${formatPriceForDisplay(
              quantity
                ? serviceListing.basePrice * quantity
                : serviceListing.basePrice,
            )}`}
            type="TOTALPRICE"
            variant="outline"
            square={true}
            size="lg"
          />
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default CartItemCard;
