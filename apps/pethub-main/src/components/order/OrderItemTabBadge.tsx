import { Badge, Text, BadgeProps } from "@mantine/core";
import React from "react";

interface OrderItemTabBadgeProps extends BadgeProps {
  count: number;
}

const OrderItemTabBadge = ({ count, ...props }: OrderItemTabBadgeProps) => {
  return (
    <Badge
      miw={16}
      h={16}
      sx={{ pointerEvents: "none" }}
      variant="filled"
      size="xs"
      p={1}
    >
      {count}
    </Badge>
  );
};

export default OrderItemTabBadge;