import {
  Badge,
  Box,
  Button,
  Center,
  CopyButton,
  Divider,
  Grid,
  Rating,
  Stack,
  Stepper,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconCopy,
  IconFileDownload,
  IconPaw,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  OrderItem,
  OrderItemStatusEnum,
  formatISODateTimeShort,
  formatISODayDateTime,
  formatNumber2Decimals,
  getErrorMessageProps,
} from "shared-utils";
import { useCartOperations } from "@/hooks/cart";
import { useDeleteReview } from "@/hooks/review";
import { CartItem } from "@/types/types";
import SelectTimeslotModal from "../appointment-booking/SelectTimeslotModal";
import ReviewModal from "../review/ReviewModal";

interface OrderItemStepperContentProps {
  userId: number;
  orderItem: OrderItem;
  refetch: () => Promise<any>;
}

const OrderItemStepperContent = ({
  userId,
  orderItem,
  refetch,
  ...props
}: OrderItemStepperContentProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { addItemToCart } = useCartOperations(userId);
  const [
    timeslotModalOpened,
    { open: openTimeslotModal, close: closeTimeslotModal },
  ] = useDisclosure(false);
  const [
    reviewModalOpened,
    { open: openReviewModal, close: closeReviewModal },
  ] = useDisclosure(false);

  function triggerNotImplementedNotification() {
    notifications.show({
      title: "Not Implemented",
      color: "orange",
      message: "This function will be implemented in SR4",
    });
  }

  async function buyAgainHandler() {
    await addItemToCart(
      {
        serviceListing: orderItem?.serviceListing,
        ...(orderItem?.serviceListing.calendarGroupId ? {} : { quantity: 1 }),
        isSelected: true,
      } as CartItem,
      1,
    );
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

  function viewInvoiceHandler() {
    if (orderItem?.attachmentURL) {
      window.open(orderItem?.attachmentURL, "_blank"); // _blank === New tab
    } else {
      notifications.show({
        title: "Error Viewing Invoice",
        color: "red",
        message:
          "Invoice URL was not found. Please contact PetHub customer support for further clarification",
      });
    }
  }

  async function deleteReviewHandler() {
    await handleDeleteReview(orderItem?.review?.reviewId);
    await refetch();
  }

  const deleteReviewMutation = useDeleteReview();
  const handleDeleteReview = async (id: number) => {
    try {
      await deleteReviewMutation.mutateAsync(id);
      notifications.show({
        title: "Review Removed",
        color: "green",
        icon: <IconCheck />,
        message: `Your review has been removed for this order.`,
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Review", error),
      });
    }
  };

  // ================================= FAKE REFUND STUFF ================================= //
  // Add 3 days from expiry date for now 2359
  const fakeRefundDate = formatISODateTimeShort(
    dayjs(orderItem?.expiryDate)
      .add(3, "day")
      .endOf("day")
      .toISOString(),
  );
  const eligibleForRefund = dayjs().isBefore(
    dayjs(orderItem?.expiryDate)
      .add(3, "day")
      .endOf("day"),
  );
  // ================================= FAKE REFUND STUFF ================================= //

  const dividerColumn = (
    <Grid.Col>
      <Divider />
    </Grid.Col>
  );

  const invoiceColumn = (
    <>
      <Grid.Col span={8} />
      <Grid.Col span={4}>
        <Button
          fullWidth
          variant="light"
          sx={{ border: "1px solid #e0e0e0" }}
          onClick={viewInvoiceHandler}
          leftIcon={<IconFileDownload size="1rem" />}
        >
          View Invoice
        </Button>
      </Grid.Col>
    </>
  );

  const buyAgainColumn = (
    <>
      <Grid.Col span={6}>
        {orderItem?.status === OrderItemStatusEnum.Expired ? (
          <Text size="xs" color="red">
            Your order has reached the end of the validity period and expired on{" "}
            <b>{formatISODayDateTime(orderItem?.expiryDate)}</b>
          </Text>
        ) : orderItem?.status === OrderItemStatusEnum.Refunded ? (
          <Text size="xs" color="orange">
            The amount of ${formatNumber2Decimals(orderItem?.itemPrice)} has
            been refunded to your original payment method.
          </Text>
        ) : (
          <Text size="xs">
            Satisfied with your purchase? Your furry friend might appreciate a
            repeat! Why not <b>buy it again</b> and keep those tails wagging?
          </Text>
        )}
      </Grid.Col>
      <Grid.Col span={2} />
      <Grid.Col span={4}>
        <Button fullWidth onClick={buyAgainHandler}>
          Buy Again
        </Button>
      </Grid.Col>
    </>
  );

  const bookNowColumn = (
    <>
      <Grid.Col span={6}>
        {orderItem?.booking ? (
          <Text size="xs">
            You are eligible to reschedule until before the end of the validity
            period on <b>{formatISODayDateTime(orderItem?.expiryDate)}</b>
          </Text>
        ) : (
          <Text size="xs">
            Make your booking and redeem your voucher before the end of the
            validity period on{" "}
            <b>{formatISODayDateTime(orderItem?.expiryDate)}</b>
          </Text>
        )}
      </Grid.Col>
      <Grid.Col span={2} />
      <Grid.Col span={4}>
        <Button fullWidth variant="filled" onClick={bookNowHandler}>
          {orderItem?.booking ? "Reschedule" : "Book now"}
        </Button>
      </Grid.Col>
    </>
  );

  const voucherColumn = (
    <>
      <Grid.Col span={8} />
      <Grid.Col span={4}>
        <CopyButton value={orderItem?.voucherCode} timeout={3000}>
          {({ copied, copy }) => (
            <Button
              color={copied ? "green" : null}
              onClick={copy}
              fullWidth
              variant="light"
              sx={{ border: "1px solid #e0e0e0", backgroundColor: "white" }}
              leftIcon={<IconCopy size="1rem" />}
            >
              {copied
                ? "Copied to clipboard"
                : `Voucher Code: ${orderItem?.voucherCode}`}
            </Button>
          )}
        </CopyButton>
      </Grid.Col>
    </>
  );

  const reviewColumn = (
    <>
      <Grid.Col span={7}>
        {orderItem?.review ? (
          <>
            <Text size="xs">
              Paw-some! Thank you for leaving your review below titled:
            </Text>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Text size="xs" lineClamp={1}>
                ~<strong>{orderItem?.review?.title}</strong>~&nbsp;
              </Text>
              <Rating
                value={orderItem?.review?.rating}
                readOnly
                emptySymbol={
                  <IconPaw
                    size="1.5rem"
                    color={theme.colors.yellow[7]}
                    strokeWidth={1.5}
                  />
                }
                fullSymbol={
                  <IconPaw
                    size="1.5rem"
                    color={theme.colors.yellow[7]}
                    fill={theme.colors.yellow[5]}
                    strokeWidth={1.5}
                  />
                }
              />
            </Box>
          </>
        ) : (
          <Text size="xs">
            🐾 Loved our products for your furry friend? We&apos;d be
            purr-fectly delighted if you could{" "}
            <strong>leave us a paw-sitive review</strong>! Your feedback helps
            other pets find their new favorites. 🐾
          </Text>
        )}
      </Grid.Col>
      <Grid.Col span={1} />
      <Grid.Col span={4}>
        {orderItem?.review ? (
          <Center>
            <Button
              fullWidth
              variant="light"
              color="orange"
              sx={{ border: "1px solid #e0e0e0" }}
              onClick={openReviewModal}
            >
              Edit Review
            </Button>
            &nbsp;
            <Button
              fullWidth
              variant="light"
              color="pink"
              sx={{ border: "1px solid #e0e0e0" }}
              onClick={deleteReviewHandler}
            >
              Remove Review
            </Button>
          </Center>
        ) : (
          <Button
            fullWidth
            variant="light"
            color="orange"
            sx={{ border: "1px solid #e0e0e0" }}
            onClick={openReviewModal}
          >
            Review
          </Button>
        )}
      </Grid.Col>
    </>
  );

  const refundColumn = (
    <>
      <Grid.Col span={6}>
        <Text size="xs" color="dimmed">
          {eligibleForRefund
            ? `You are eligible to request for a refund until ${fakeRefundDate}.`
            : `You are no longer eligible for a refund as the last refund date ${fakeRefundDate} has passed.`}
        </Text>
      </Grid.Col>
      <Grid.Col span={2} />
      <Grid.Col span={4}>
        <Button
          fullWidth
          color="red"
          variant="light"
          sx={{ border: "1px solid #e0e0e0" }}
          onClick={triggerNotImplementedNotification}
          disabled={eligibleForRefund ? false : true}
        >
          Refund
        </Button>
      </Grid.Col>
    </>
  );

  const displayBookingColumn = (text?: string) => {
    return (
      <>
        {orderItem?.booking && (
          <>
            <Grid.Col>
              <Divider />
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="xs" color="dimmed">
                {text}
              </Text>
            </Grid.Col>
            <Grid.Col span={2} />
            <Grid.Col span={4}>
              <Stack sx={{ display: "flex", alignItems: "flex-end" }}>
                <Text size="sm" mb={-10}>
                  <b>Start: </b>
                  {formatISODayDateTime(orderItem?.booking.startTime)}
                </Text>
                <Text size="sm">
                  <b>End: </b>
                  {formatISODayDateTime(orderItem?.booking.endTime)}
                </Text>
              </Stack>
            </Grid.Col>
          </>
        )}
      </>
    );
  };

  const pendingBookingGroup = (
    <>
      {bookNowColumn}
      {dividerColumn}
      {refundColumn}
      {dividerColumn}
      {invoiceColumn}
      {dividerColumn}
      {voucherColumn}
    </>
  );

  const pendingFulfillmentGroup = (
    <>
      {orderItem?.serviceListing.requiresBooking && (
        <>
          {bookNowColumn}
          {dividerColumn}
        </>
      )}
      {refundColumn}
      {dividerColumn}
      {invoiceColumn}
      {dividerColumn}
      {voucherColumn}
      {orderItem?.serviceListing.requiresBooking &&
        displayBookingColumn(
          "You have scheduled a booking for this item on the timing displayed here. Please present the voucher code to the establishment to complete your purchase.",
        )}
    </>
  );

  const fulfilledGroup = (
    <>
      {buyAgainColumn}
      {dividerColumn}
      {refundColumn}
      {dividerColumn}
      {reviewColumn}
      {dividerColumn}
      {invoiceColumn}
      {orderItem?.serviceListing.requiresBooking && displayBookingColumn()}
    </>
  );

  const expiredAndRefundedGroup = (
    <>
      {buyAgainColumn}
      {dividerColumn}
      {invoiceColumn}
      {orderItem?.serviceListing.requiresBooking && displayBookingColumn()}
    </>
  );

  function renderContent() {
    switch (orderItem?.status) {
      case OrderItemStatusEnum.PendingBooking:
        return pendingBookingGroup;

      case OrderItemStatusEnum.PendingFulfillment:
        return pendingFulfillmentGroup;

      case OrderItemStatusEnum.Fulfilled:
      case OrderItemStatusEnum.PaidOut:
        return fulfilledGroup;

      case OrderItemStatusEnum.Expired:
      case OrderItemStatusEnum.Refunded:
        return expiredAndRefundedGroup;

      default:
        return null;
    }
  }

  return (
    <Grid mt="xl">
      {renderContent()}
      <SelectTimeslotModal
        petOwnerId={userId}
        orderItem={orderItem}
        serviceListing={orderItem?.serviceListing}
        opened={timeslotModalOpened}
        onClose={closeTimeslotModal}
        isUpdating={!!orderItem?.booking}
        onUpdateBooking={refetch}
        booking={orderItem?.booking as any}
      />
      <ReviewModal
        orderItem={orderItem}
        userId={userId}
        opened={reviewModalOpened}
        onClose={closeReviewModal}
        onCreateOrUpdate={refetch}
      />
    </Grid>
  );
};

export default OrderItemStepperContent;
