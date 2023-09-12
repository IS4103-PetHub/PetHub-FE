import { Badge, BadgeProps } from "@mantine/core";
import React from "react";

interface AccountStatusBadgeProps extends BadgeProps {
  accountStatus: string;
}

const AccountStatusBadge = ({
  accountStatus,
  ...props
}: AccountStatusBadgeProps) => {
  //key: accountStatus
  //value: badge colour
  const colourMap = new Map([
    ["INACTIVE", "red"],
    ["ACTIVE", "green"],
  ]);

  return (
    <Badge
      color={
        colourMap.has(accountStatus) ? colourMap.get(accountStatus) : "gray"
      }
      {...props}
    >
      {accountStatus}
    </Badge>
  );
};

export default AccountStatusBadge;
