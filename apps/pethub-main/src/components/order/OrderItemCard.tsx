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
  CopyButton,
  Center,
  Alert,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconBuildingStore,
  IconCopy,
  IconMapPin,
  IconPaw,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  OrderItemStatusEnum,
  ServiceListing,
  convertMinsToDurationString,
  formatISODayDateTime,
} from "shared-utils";
import NumberInputWithIcons from "web-ui/shared/NumberInputWithIcons";
import { useCartOperations } from "@/hooks/cart";
import { Booking, CartItem } from "@/types/types";
import { formatPriceForDisplay } from "@/util";
import OrderItemBadge from "./OrderItemBadge";
import OrderItemPopover from "./OrderItemPopover";

interface OrderItemCardProps {
  userId: number;
  itemId: number;
  orderId: string;
  price: number;
  quantity: number;
  voucherCode: string;
  serviceListing: any; // change to ServiceListing after we move away from mock data
  booking: any; // change to Booking after we move away from mock data
  status: string;
}

const OrderItemCard = ({
  userId,
  itemId,
  orderId,
  price,
  quantity,
  voucherCode,
  serviceListing,
  booking,
  status,
}: OrderItemCardProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { addItemToCart } = useCartOperations(userId);

  // Not accurate, test it again after we move away from mock data
  async function buyAgainHandler() {
    const quantityToRebuy = quantity ? quantity : 1;
    await addItemToCart(
      {
        serviceListing: serviceListing,
        ...(serviceListing.calendarGroupId
          ? {}
          : { quantity: quantityToRebuy }),
        isSelected: true,
      } as CartItem,
      Number(quantityToRebuy),
    );
    router.push("/customer/cart");
  }

  const orderItemFooterGroup = (
    <>
      {status === OrderItemStatusEnum.PendingBooking && (
        <>
          <Button color="red" variant="light" size="xs" miw={90} mr={-5}>
            Cancel
          </Button>
          <Button color="indigo" variant="filled" miw={90} size="xs" mr={-10}>
            Book now
          </Button>
          <OrderItemPopover
            text={`Make your booking and redeem your voucher before the end of the validity period on ${formatISODayDateTime(
              serviceListing.lastPossibleDate,
            )}`}
          />
        </>
      )}
      {status === OrderItemStatusEnum.PendingFulfillment && (
        <>
          <OrderItemPopover
            text={`Redeem your voucher before the end of the validity period on ${formatISODayDateTime(
              serviceListing.lastPossibleDate,
            )}`}
          />
          <Center>
            <Text size="xs" fw={500} ml={-15}>
              Voucher Code:
            </Text>
            &nbsp;
            <Badge radius="xs" c="indigo" p={2} variant="">
              {voucherCode}
            </Badge>
            <CopyButton value={voucherCode} timeout={3000}>
              {({ copied, copy }) => (
                <Button
                  color={copied ? "teal" : "dark"}
                  onClick={copy}
                  leftIcon={
                    <IconCopy size="1rem" style={{ marginRight: -5 }} />
                  }
                  size="xs"
                  variant="subtle"
                  compact
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </CopyButton>
          </Center>
        </>
      )}
      {/* In the future, review should be changed to "View review" if already reviewed */}
      {(status === OrderItemStatusEnum.Fulfilled ||
        status === OrderItemStatusEnum.PaidOut) && (
        <>
          <Button color="indigo" variant="light" size="xs" miw={90} mr={-5}>
            Review
          </Button>
          <Button
            color="indigo"
            variant="filled"
            size="xs"
            miw={90}
            onClick={buyAgainHandler}
          >
            Buy again
          </Button>
        </>
      )}
      {status === OrderItemStatusEnum.Expired && (
        <>
          <Text size="xs" fw={500} color="red">
            You did not redeem your voucher before the end of the validity
            period on {formatISODayDateTime(serviceListing.lastPossibleDate)}
          </Text>
        </>
      )}
      {status === OrderItemStatusEnum.Refunded && (
        <>
          <Text size="xs" fw={500} color="orange">
            The amount of ${formatPriceForDisplay(price)} has been refunded to
            your original payment method
          </Text>
        </>
      )}
    </>
  );

  return (
    <Card withBorder mb="lg" mah={225} mih={225} radius="xs" shadow="xs">
      <Group position="apart" mb={5} mt={-5}>
        <Center>
          <Text fw={500} mr={2} size="sm">
            {serviceListing?.petBusiness?.companyName}
          </Text>
          <Button
            size="xs"
            variant="subtle"
            leftIcon={
              <IconBuildingStore size="1rem" style={{ marginRight: "-5px" }} />
            }
            onClick={() =>
              router.push(
                "/pet-businesses/" + serviceListing?.petBusiness?.userId,
              )
            }
          >
            Visit Shop
          </Button>
        </Center>
        <Center>
          <Box>
            <Badge mr="md" radius="xs" c="dark" sx={{ fontWeight: 600 }}>
              Order ID: {orderId}
            </Badge>
            <OrderItemBadge text={status} />
          </Box>
        </Center>
      </Group>
      <Divider mt={1} mb="xs" />
      <Grid
        columns={24}
        sx={{
          height: "100%",
          cursor: "pointer",
        }}
        onClick={() => router.push(`/customer/orders/${itemId}`)}
      >
        <Grid.Col span={4}>
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
        <Grid.Col span={16}>
          <Box>
            <Link href={`/service-listings/${serviceListing.serviceListingId}`}>
              <Text fw={600} size={16}>
                {serviceListing.title}
              </Text>
            </Link>
            <Text lineClamp={2} size="xs">
              {serviceListing.description}
            </Text>
            {serviceListing.calendarGroupId && (
              <Badge variant="dot" radius="xs">
                Duration: {convertMinsToDurationString(serviceListing.duration)}
              </Badge>
            )}
          </Box>
        </Grid.Col>
        <Grid.Col
          span={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Text size="sm" c="dark" fw={500}>
            ${formatPriceForDisplay(price)}{" "}
            {quantity && quantity !== 1 && `x ${quantity}`}
          </Text>
        </Grid.Col>
      </Grid>
      <Divider mt="xs" mb="xs" />
      <Grid
        columns={24}
        sx={{
          height: "100%",
        }}
      >
        <Grid.Col span={17}>
          <Group>{orderItemFooterGroup}</Group>
        </Grid.Col>
        <Grid.Col
          span={7}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Center>
            <IconPaw size="1rem" color="gray" />
            <Text c="dark" fw={500} size="sm" mt={1} ml={2}>
              Order Total:
            </Text>
            &nbsp;
            <Text c="dark" fw={600} size="xl">
              ${formatPriceForDisplay(quantity ? quantity * price : price)}
            </Text>
          </Center>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default OrderItemCard;
