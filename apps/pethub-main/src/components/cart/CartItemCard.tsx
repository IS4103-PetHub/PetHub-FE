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
import React, { useState } from "react";
import {
  ServiceListing,
  convertMinsToDurationString,
  formatISODayDateTime,
} from "shared-utils";
import NumberInputWithIcons from "web-ui/shared/NumberInputWithIcons";
import { Booking, CartItemBookingSelection } from "@/types/types";
import ServiceListingTags from "../service-listing-discovery/ServiceListingTags";
import CartItemBadge from "./CartItemBadge";

interface CartItemCardProps {
  serviceListing: ServiceListing;
  bookingSelection: CartItemBookingSelection;
  checked: boolean;
  onCheckedChange: (checked: any) => void;
}

const CartItemCard = ({
  serviceListing,
  bookingSelection,
  checked,
  onCheckedChange,
}: CartItemCardProps) => {
  const theme = useMantineTheme();
  const [value, setValue] = useState<number | "">(1); // Change to value from prop

  console.log("SL", serviceListing);

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
              text={`Unit price: $${serviceListing.basePrice}`}
              type="UNITPRICE"
              variant="dot"
              square={true}
            />
          )}
          &nbsp;
          <CartItemBadge
            text={`Item total: $${serviceListing.basePrice * 3}`}
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
                setValue={setValue}
                min={1}
                max={10}
                step={1}
              />
            ) : (
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
                  <b>End:</b>{" "}
                  {formatISODayDateTime(bookingSelection?.startTime)}
                </Text>
                {bookingSelection?.petName && (
                  <Text size="xs">
                    <b>Pet:</b> {bookingSelection.petName}
                  </Text>
                )}
              </Alert>
            )}
          </Group>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default CartItemCard;
