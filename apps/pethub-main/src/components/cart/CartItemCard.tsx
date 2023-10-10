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
import { useCartOperations } from "@/hooks/cart";
import { Booking, CartItemBookingSelection } from "@/types/types";
import { formatPriceForDisplay } from "@/util";
import ServiceListingTags from "../service-listing-discovery/ServiceListingTags";
import CartItemBadge from "./CartItemBadge";

interface CartItemCardProps {
  itemId: number;
  serviceListing: ServiceListing;
  checked: boolean;
  onCheckedChange: (checked: any) => void;
  setItemQuantity: (cartItemId: number, quantity: number) => void;
  removeItem: () => void;
  isExpired: boolean;
  isDisabled: boolean;
  quantity?: number;
  bookingAlert?: React.ReactNode; // This might not be needed anymore as per PH-264
}

const CartItemCard = ({
  itemId,
  serviceListing,
  checked,
  onCheckedChange,
  setItemQuantity,
  removeItem,
  quantity,
  isExpired,
  isDisabled,
  bookingAlert,
}: CartItemCardProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [value, setValue] = useState<number | "">(quantity || 1);

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

  return (
    <Card
      withBorder
      mb="lg"
      mah={240}
      mih={240}
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
            checked={checked}
            disabled={isDisabled}
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
            <Link href={`/service-listings/${serviceListing.serviceListingId}`}>
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
                  max={100}
                  step={1}
                />
              ) : (
                bookingAlert
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
