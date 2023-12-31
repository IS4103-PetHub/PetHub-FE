import { Badge, BadgeProps } from "@mantine/core";
import React from "react";

interface CartItemBadgeProps extends BadgeProps {
  text: string;
  type: string;
  square?: boolean;
}

const CartItemBadge = ({
  text,
  type,
  square = false,
  ...props
}: CartItemBadgeProps) => {
  const colourMap = new Map([
    ["UNITPRICE", "dark"],
    ["TOTALPRICE", "dark"],
    ["DURATION", "blue"],
    ["PETBUSINESS", "indigo"],
  ]);

  const additionalProps = square ? { radius: "xs" } : {};

  return (
    <Badge
      size="lg"
      {...additionalProps}
      color={colourMap.has(type) ? colourMap.get(type) : "gray"}
      {...props}
    >
      {text}
    </Badge>
  );
};

export default CartItemBadge;
