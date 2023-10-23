import { Badge, BadgeProps } from "@mantine/core";
import React from "react";
import { generateRandomIntFromInterval } from "shared-utils";

interface RainbowBadgeProps extends BadgeProps {
  text: string;
}

// this badge have random color except black, gray, yellow if color is not passed as a prop
const RainbowBadge = ({ text, ...props }: RainbowBadgeProps) => {
  const colors = [
    "red",
    "pink",
    "grape",
    "violet",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "green",
    "lime",
    "orange",
  ];

  return (
    <Badge
      {...props}
      color={colors[generateRandomIntFromInterval(0, colors.length)]}
    >
      {text}
    </Badge>
  );
};

export default RainbowBadge;
