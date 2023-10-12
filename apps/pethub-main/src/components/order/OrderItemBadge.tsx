import { Badge, Text, BadgeProps } from "@mantine/core";
import React from "react";

interface OrderItemBadgeProps extends BadgeProps {
  text: string;
}

const OrderItemBadge = ({ text, ...props }: OrderItemBadgeProps) => {
  const colourMap = new Map([
    ["PENDING_BOOKING", "indigo"],
    ["PENDING_FULFILLMENT", "violet"],
    ["FULFILLED", "green"],
    ["REFUNDED", "orange"],
    ["EXPIRED", "red"],
  ]);

  const textMap = new Map([
    ["PENDING_BOOKING", "To Book"],
    ["PENDING_FULFILLMENT", "To Fulfill"],
    ["FULFILLED", "Fulfilled"],
    ["REFUNDED", "Refunded"],
    ["EXPIRED", "Expired"],
  ]);

  return (
    <Badge
      color={colourMap.has(text) ? colourMap.get(text) : "gray"}
      radius="xs"
    >
      {textMap.has(text) ? textMap.get(text) : "STATUS_NOT_FOUND"}
    </Badge>
    // <Text c={colourMap.has(text) ? colourMap.get(text) : "gray"} fw={600} size="sm">
    //   {textMap.has(text) ? textMap.get(text) : "STATUS_NOT_FOUND"}
    // </Text>
  );
};

export default OrderItemBadge;
