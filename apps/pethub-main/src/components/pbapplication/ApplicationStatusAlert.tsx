import { Alert, BadgeProps } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import React from "react";

interface ApplicationStatusAlertProps extends BadgeProps {
  applicationStatus: string;
}

// Duplicated from AccountStatusBadge in shared/web-ui
const ApplicationStatusAlert = ({
  applicationStatus,
  ...props
}: ApplicationStatusAlertProps) => {
  const colourMap = new Map([
    ["REJECTED", "orange"],
    ["APPROVED", "green"],
    ["PENDING", "grey"],
  ]);

  const messageMap = new Map([
    ["REJECTED", "Your application has been rejected. Please see remarks:"],
    ["APPROVED", "Your application has been approved!"],
    [
      "PENDING",
      "Your application is pending review from our administrator staff. ",
    ],
  ]);

  return (
    <Alert
      color={
        colourMap.has(applicationStatus)
          ? colourMap.get(applicationStatus)
          : "gray"
      }
      {...props}
      icon={<IconAlertCircle size="1rem" />}
      title={applicationStatus}
      mb="md"
    >
      {messageMap.has(applicationStatus)
        ? messageMap.get(applicationStatus)
        : "An error has occured."}
    </Alert>
  );
};

export default ApplicationStatusAlert;
