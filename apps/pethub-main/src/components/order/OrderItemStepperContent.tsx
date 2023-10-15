import {
  Badge,
  Box,
  Button,
  CopyButton,
  Divider,
  Grid,
  Stack,
  Stepper,
  Text,
} from "@mantine/core";
import { IconCopy } from "@tabler/icons-react";
import React, { useState } from "react";
import {
  OrderItem,
  OrderItemStatusEnum,
  formatISODayDateTime,
} from "shared-utils";

interface OrderItemStepperContentProps {
  orderItem: OrderItem;
}

const OrderItemStepperContent = ({
  orderItem,
  ...props
}: OrderItemStepperContentProps) => {
  const invoiceColumn = (
    <>
      <Grid.Col>
        <Divider />
      </Grid.Col>
      <Grid.Col span={8} />
      <Grid.Col span={4}>
        <Button fullWidth variant="light" sx={{ border: "1px solid #e0e0e0" }}>
          View Invoice
        </Button>
      </Grid.Col>
    </>
  );

  const buyAgainColumn = (
    <>
      <Grid.Col>
        <Divider />
      </Grid.Col>
      <Grid.Col span={6}>
        <Text size="xs">
          Satisfied with your purchase? Your furry friend might appreciate a
          repeat! Why not <b>buy it again</b> and keep those tails wagging?
        </Text>
      </Grid.Col>
      <Grid.Col span={2} />
      <Grid.Col span={4}>
        <Button fullWidth>Buy Again</Button>
      </Grid.Col>
    </>
  );

  const bookNowColumn = (
    <>
      <Grid.Col>
        <Divider />
      </Grid.Col>
      <Grid.Col span={6}>
        <Text size="xs">
          Make your booking and redeem your voucher before the end of the
          validity period on <b>{formatISODayDateTime(orderItem.expiryDate)}</b>
        </Text>
      </Grid.Col>
      <Grid.Col span={2} />
      <Grid.Col span={4}>
        <Button fullWidth variant="filled">
          Book Now
        </Button>
      </Grid.Col>
    </>
  );

  const refundColumn = (
    <>
      <Grid.Col>
        <Divider />
      </Grid.Col>
      <Grid.Col span={8} />
      <Grid.Col span={4}>
        <Button
          fullWidth
          color="red"
          variant="outline"
          sx={{ border: "1px solid #e0e0e0" }}
        >
          Refund
        </Button>
      </Grid.Col>
    </>
  );

  const voucherColumn = (
    <>
      <Grid.Col>
        <Divider />
      </Grid.Col>
      <Grid.Col span={8} />
      <Grid.Col span={4}>
        <CopyButton value={orderItem.voucherCode} timeout={3000}>
          {({ copied, copy }) => (
            <Button
              color={copied ? "green" : "indigo"}
              onClick={copy}
              fullWidth
              variant="light"
              sx={{ border: "1px solid #e0e0e0" }}
            >
              <IconCopy size="1rem" /> &nbsp;
              {copied
                ? "Copied to clipboard"
                : `Voucher Code: ${orderItem.voucherCode}`}
            </Button>
          )}
        </CopyButton>
      </Grid.Col>
    </>
  );

  const reviewColumn = (
    <>
      <Grid.Col>
        <Divider />
      </Grid.Col>
      <Grid.Col span={8}>
        <Text size="xs">
          🐾 Loved our products for your furry friend? We&apos;d be purr-fectly
          delighted if you could <strong>leave us a paw-sitive review</strong>!
          Your feedback helps other pets find their new favorites. 🐾
        </Text>
      </Grid.Col>
      <Grid.Col span={4}>
        <Button fullWidth variant="light" color="orange">
          Review
        </Button>
      </Grid.Col>
    </>
  );

  const displayBookingColumn = (text?: string) => {
    return (
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
            <Text size="sm">
              <b>Start: </b>
              {formatISODayDateTime(orderItem?.booking?.startTime)}
            </Text>
            <Text size="sm">
              <b>End: </b>
              {formatISODayDateTime(orderItem?.booking?.endTime)}
            </Text>
          </Stack>
        </Grid.Col>
      </>
    );
  };

  const pendingBookingGroup = (
    <>
      {bookNowColumn}
      {refundColumn}
      {invoiceColumn}
      {voucherColumn}
    </>
  );

  const pendingFulfillmentGroup = (
    <>
      {orderItem.serviceListing.requiresBooking && bookNowColumn}
      {invoiceColumn}
      {voucherColumn}
      {orderItem.serviceListing.requiresBooking &&
        displayBookingColumn(
          "You have scheduled a booking for this item on the timing displayed here. Please present the voucher code to the establishment to complete your purchase.",
        )}
    </>
  );

  const fulfilledGroup = (
    <>
      {buyAgainColumn}
      {reviewColumn}
      {invoiceColumn}
      {orderItem.serviceListing.requiresBooking && displayBookingColumn()}
    </>
  );

  const expiredOrRefundedGroup = (
    <>
      {buyAgainColumn}
      {invoiceColumn}
      {orderItem.serviceListing.requiresBooking && displayBookingColumn()}
    </>
  );

  function renderContent() {
    if (orderItem.status === OrderItemStatusEnum.PendingBooking) {
      return pendingBookingGroup;
    }
    if (orderItem.status === OrderItemStatusEnum.PendingFulfillment) {
      return pendingFulfillmentGroup;
    }

    if (
      orderItem.status === OrderItemStatusEnum.Fulfilled ||
      orderItem.status === OrderItemStatusEnum.PaidOut
    ) {
      return fulfilledGroup;
    }

    if (
      orderItem.status === OrderItemStatusEnum.Expired ||
      orderItem.status === OrderItemStatusEnum.Refunded
    ) {
      return expiredOrRefundedGroup;
    }
  }

  return <Grid mt="xl">{renderContent()}</Grid>;
};

export default OrderItemStepperContent;
