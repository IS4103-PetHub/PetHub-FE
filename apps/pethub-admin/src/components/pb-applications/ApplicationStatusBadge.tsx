import { Badge, BadgeProps } from "@mantine/core";
import React from "react";

interface ApplicationStatusBadgeProps extends BadgeProps {
  applicationStatus: string;
}

const ApplicationStatusBadge = ({
  applicationStatus,
  ...props
}: ApplicationStatusBadgeProps) => {
  const colourMap = new Map([
    ["PENDING", "yellow"],
    ["REJECTED", "red"],
    ["APPROVED", "green"],
  ]);

  return (
    <Badge
      color={
        colourMap.has(applicationStatus)
          ? colourMap.get(applicationStatus)
          : "gray"
      }
      {...props}
    >
      {applicationStatus}
    </Badge>
  );
};
export default ApplicationStatusBadge;
