import { Alert, Button } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";

interface ApplicationStatusAlertProps {
  applicationStatus: string | undefined;
}

const ApplicationStatusAlert = ({
  applicationStatus,
  ...props
}: ApplicationStatusAlertProps) => {
  const router = useRouter();

  if (!applicationStatus) {
    return null;
  }

  const colourMap = new Map([
    ["REJECTED", "orange"],
    ["APPROVED", "green"],
    ["PENDING", "grey"],
  ]);

  const messageMap = new Map([
    [
      "REJECTED",
      "This application has been rejected and is pending further updates from the applicant. Please check back later.",
    ],
    [
      "PENDING",
      "This application is pending your review. Please review the application and take the appropriate action.",
    ],
    ["APPROVED", "This application has already been approved."],
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
