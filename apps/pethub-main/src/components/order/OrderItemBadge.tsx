import { Badge, Text, BadgeProps } from "@mantine/core";
import React from "react";

interface OrderItemBadgeProps extends BadgeProps {
  text: string;
}

const OrderItemBadge = ({ text, ...props }: OrderItemBadgeProps) => {
  const colourMap = new Map([
    ["PENDING_BOOKING", "indigo"],
    ["PENDING_FULFILLMENT", "violet"],
    ["FULFILLED", "green"], // Paid out is the same as fulfilled
    ["PAID_OUT", "green"],
    ["REFUND_PENDING", "orange"],
    ["REFUNDED", "orange"],
    ["EXPIRED", "red"],
  ]);

  const textMap = new Map([
    ["PENDING_BOOKING", "To Book"],
    ["PENDING_FULFILLMENT", "To Fulfill"],
    ["FULFILLED", "Fulfilled"],
    ["PAID_OUT", "Fulfilled"], // Paid out is the same as fulfilled
    ["REFUND_PENDING", "Pending Refund"],
    ["REFUNDED", "Refunded"],
    ["EXPIRED", "Expired"],
  ]);

  return (
    <Badge
      color={colourMap.has(text) ? colourMap.get(text) : "gray"}
      radius="xs"
      sx={{ fontWeight: 800 }}
    >
      {textMap.has(text) ? textMap.get(text) : "STATUS_NOT_FOUND"}
    </Badge>
  );
};

export default OrderItemBadge;
