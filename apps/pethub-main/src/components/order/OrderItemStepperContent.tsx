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
        <Button fullWidth variant="light">
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

  const pendingBookingGroup = (
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

      <Grid.Col>
        <Divider />
      </Grid.Col>
      <Grid.Col span={8} />
      <Grid.Col span={4}>
        <Button fullWidth color="red" variant="outline">
          Cancel
        </Button>
      </Grid.Col>

      {invoiceColumn}

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

  const pendingFulfillmentGroup = (
    <>
      {orderItem.serviceListing.requiresBooking && (
        <>
          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="xs">
              You are eligible to reschedule and redeem your voucher until
              before the end of the validity period on{" "}
              <b>{formatISODayDateTime(orderItem.expiryDate)}</b>
            </Text>
          </Grid.Col>
          <Grid.Col span={2} />
          <Grid.Col span={4}>
            <Button fullWidth variant="filled">
              Reschedule
            </Button>
          </Grid.Col>
        </>
      )}

      {invoiceColumn}

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
            >
              <IconCopy size="1rem" /> &nbsp;
              {copied
                ? "Copied to clipboard"
                : `Voucher Code: ${orderItem.voucherCode}`}
            </Button>
          )}
        </CopyButton>
      </Grid.Col>

      {orderItem.serviceListing.requiresBooking && (
        <>
          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="xs" color="dimmed">
              You have scheduled a booking for this item on the timing displayed
              here. Please present the voucher code to the establishment to
              complete your purchase.
            </Text>
          </Grid.Col>
          <Grid.Col span={2} />
          <Grid.Col span={4}>
            <Stack>
              <Text size="xs">
                <b>Start: </b>
                {formatISODayDateTime(orderItem?.booking?.startTime)}
              </Text>
              <Text size="xs">
                <b>End: </b>
                {formatISODayDateTime(orderItem?.booking?.endTime)}
              </Text>
            </Stack>
          </Grid.Col>
        </>
      )}
    </>
  );

  const fulfilledGroup = (
    <>
      {buyAgainColumn}

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

      {invoiceColumn}

      {orderItem.serviceListing.requiresBooking && (
        <>
          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={6} />
          <Grid.Col span={2} />
          <Grid.Col span={4}>
            <Stack>
              <Text size="xs">
                <b>Start: </b>
                {formatISODayDateTime(orderItem?.booking?.startTime)}
              </Text>
              <Text size="xs">
                <b>End: </b>
                {formatISODayDateTime(orderItem?.booking?.endTime)}
              </Text>
            </Stack>
          </Grid.Col>
        </>
      )}
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
  }

  return <Grid mt="xl">{renderContent()}</Grid>;
};

export default OrderItemStepperContent;
