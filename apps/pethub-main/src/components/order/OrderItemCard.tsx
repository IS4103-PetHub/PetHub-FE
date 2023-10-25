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
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
  Invoice,
  OrderItem,
  OrderItemStatusEnum,
  ServiceListing,
  convertMinsToDurationString,
  formatISODateLong,
  formatISODateOnly,
  formatISODateTimeShort,
  formatISODayDateTime,
} from "shared-utils";
import { formatNumber2Decimals } from "shared-utils";
import NumberInputWithIcons from "web-ui/shared/NumberInputWithIcons";
import { useCartOperations } from "@/hooks/cart";
import { Booking, CartItem } from "@/types/types";
import SelectTimeslotModal from "../appointment-booking/SelectTimeslotModal";
import ReviewModal from "../review/ReviewModal";
import OrderItemBadge from "./OrderItemBadge";
import OrderItemPopover from "./OrderItemPopover";

interface OrderItemCardProps {
  userId: number;
  orderItem: OrderItem;
}

const OrderItemCard = ({ userId, orderItem }: OrderItemCardProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [
    timeslotModalOpened,
    { open: openTimeslotModal, close: closeTimeslotModal },
  ] = useDisclosure(false);
  const [
    reviewModalOpened,
    { open: openReviewModal, close: closeReviewModal },
  ] = useDisclosure(false);
  const { addItemToCart } = useCartOperations(userId);
  const [visible, { toggle }] = useDisclosure(false);

  function triggerNotImplementedNotification() {
    notifications.show({
      title: "Not Implemented",
      color: "orange",
      message: "This function will be implemented in SR4",
    });
  }

  function navToOrderDetailsPage() {
    router.push(`/customer/orders/${orderItem?.orderItemId}`);
  }

  async function buyAgainHandler() {
    await addItemToCart({
      serviceListing: orderItem?.serviceListing,
      quantity: 1,
      isSelected: true,
    } as CartItem);
    notifications.show({
      title: "Added to cart",
      color: "green",
      message: "Item has been added to cart",
    });
    router.push("/customer/cart");
  }

  function bookNowHandler() {
    openTimeslotModal();
  }

  function viewDetailsHandler() {
    toggle();
    router.push(`/customer/orders/${orderItem?.orderItemId}`);
  }

  const orderItemFooterGroup = (
    <>
      {orderItem?.status === OrderItemStatusEnum.PendingBooking && (
        <>
          <Button miw={90} size="xs" mr={-5} onClick={bookNowHandler}>
            Book now
          </Button>
          <Button
            color="red"
            variant="light"
            size="xs"
            miw={90}
            onClick={triggerNotImplementedNotification}
            mr={-5}
          >
            Refund
          </Button>
          <OrderItemPopover
            text={`Make your booking and redeem your voucher before the end of the validity period on ${formatISODayDateTime(
              orderItem?.expiryDate,
            )}`}
          />
        </>
      )}
      {orderItem?.status === OrderItemStatusEnum.PendingFulfillment && (
        <>
          {orderItem?.booking && (
            <Button miw={90} size="xs" mr={-10} onClick={bookNowHandler}>
              Reschedule
            </Button>
          )}
          <OrderItemPopover
            text={`Redeem your voucher before the end of the validity period on ${formatISODayDateTime(
              orderItem?.expiryDate,
            )}`}
          />
          <Center>
            <Text size="xs" fw={500} ml={-15}>
              Voucher Code:
            </Text>
            &nbsp;
            <Badge radius="xs" c="indigo" p={2} variant="">
              {orderItem?.voucherCode}
            </Badge>
            <CopyButton value={orderItem?.voucherCode} timeout={3000}>
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
      {(orderItem?.status === OrderItemStatusEnum.Fulfilled ||
        orderItem?.status === OrderItemStatusEnum.PaidOut) && (
        <>
          <Button size="xs" miw={90} onClick={buyAgainHandler} mr={-5}>
            Buy again
          </Button>
          <Button
            variant="light"
            size="xs"
            miw={90}
            onClick={openReviewModal}
            mr={-5}
          >
            {orderItem?.review ? "Edit Review" : "Review"}
          </Button>
          {!orderItem?.review && (
            <OrderItemPopover
              text={`Please ensure that you remain respectful, truthful, and constructive in your review. Do not give irrelevant feedback, use offensive language or photos, or disclose any personal information. Failure to comply might result in your review getting removed.`}
            />
          )}
        </>
      )}
      {orderItem?.status === OrderItemStatusEnum.Expired && (
        <>
          <Text size="xs" fw={500} color="red">
            You did not redeem your voucher before the end of the validity
            period on {formatISODayDateTime(orderItem?.expiryDate)}
          </Text>
        </>
      )}
      {orderItem?.status === OrderItemStatusEnum.Refunded && (
        <>
          <Text size="xs" fw={500} color="orange">
            The amount of ${formatNumber2Decimals(orderItem?.itemPrice)} has
            been refunded to your original payment method
          </Text>
        </>
      )}
    </>
  );

  return (
    <Card withBorder mih={225} radius="xs" shadow="xs">
      <Group position="apart" mb={5} mt={-5}>
        <Center>
          <Text fw={500} mr={2} size="sm">
            {orderItem?.serviceListing?.petBusiness?.companyName}
          </Text>
          <Button
            size="xs"
            variant="subtle"
            leftIcon={
              <IconBuildingStore size="1rem" style={{ marginRight: "-5px" }} />
            }
            onClick={() =>
              router.push(
                "/pet-businesses/" + orderItem?.serviceListing?.petBusinessId,
              )
            }
          >
            Visit Shop
          </Button>
        </Center>
        <Center>
          <Text size="xs" mr="md" fw={500} mt={3}>
            Ordered on: {formatISODateTimeShort(orderItem?.invoice.createdAt)}
          </Text>
          <Box>
            <Badge mr="md" radius="xl" c="dark" sx={{ fontWeight: 600 }}>
              Item ID: {orderItem?.orderItemId}
            </Badge>
            <OrderItemBadge text={orderItem?.status} />
          </Box>
        </Center>
      </Group>
      <Divider mt={1} mb="xs" />
      <Grid
        columns={24}
        sx={{
          height: "100%",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[1],
          },
        }}
        onClick={viewDetailsHandler}
      >
        <LoadingOverlay
          visible={visible}
          overlayBlur={0.1}
          loaderProps={{ size: "sm", color: "indigo", variant: "bars" }}
        />
        <Grid.Col span={4} mih={125}>
          {orderItem?.serviceListing?.attachmentURLs?.length > 0 ? (
            <Image
              radius="md"
              src={orderItem?.serviceListing.attachmentURLs[0]}
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
            <Text fw={600} size={16}>
              {orderItem?.serviceListing.title}
            </Text>
            <Text lineClamp={2} size="xs">
              {orderItem?.serviceListing.description}
            </Text>
            {orderItem?.serviceListing.duration && (
              <Badge variant="dot" radius="xs">
                Duration:{" "}
                {convertMinsToDurationString(
                  orderItem?.serviceListing.duration,
                )}
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
            ${formatNumber2Decimals(orderItem?.itemPrice)}
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
              ${formatNumber2Decimals(orderItem?.itemPrice)}
            </Text>
          </Center>
        </Grid.Col>
      </Grid>
      <SelectTimeslotModal
        petOwnerId={userId}
        opened={timeslotModalOpened}
        onClose={closeTimeslotModal}
        orderItem={orderItem}
        serviceListing={orderItem?.serviceListing}
        isUpdating={!!orderItem?.booking}
        onCreateBooking={navToOrderDetailsPage}
        onUpdateBooking={navToOrderDetailsPage}
        booking={orderItem?.booking as any}
      />
      <ReviewModal
        orderItem={orderItem}
        userId={userId}
        opened={reviewModalOpened}
        onClose={closeReviewModal}
      />
    </Card>
  );
};

export default OrderItemCard;
