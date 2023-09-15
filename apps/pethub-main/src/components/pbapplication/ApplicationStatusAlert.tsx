import { Alert, BadgeProps, Button, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";

interface ApplicationStatusAlertProps extends BadgeProps {
  applicationStatus: string;
  forDashboard: boolean;
  remarks?: string[];
}

// Duplicated from AccountStatusBadge in shared/web-ui
const ApplicationStatusAlert = ({
  applicationStatus,
  forDashboard,
  remarks,
  ...props
}: ApplicationStatusAlertProps) => {
  const router = useRouter();

  const colourMap = new Map([
    ["REJECTED", "orange"],
    ["APPROVED", "green"],
    ["PENDING", "grey"],
    ["NOTFOUND", "red"],
  ]);

  const ApplyButton = (
    <Button
      mt="md"
      onClick={() => router.push("/business/application")}
      variant="gradient"
    >
      Apply now
    </Button>
  );

  const LinkButton = (
    <Button mt="md" onClick={() => router.push("/business/application")}>
      View
    </Button>
  );

  const messageMap = forDashboard
    ? new Map([
        [
          "REJECTED",
          "Your application has been rejected. Please update your application",
        ],
        [
          "NOTFOUND",
          "Your pet business account currently has limited functionality. Apply and become a PetHub Partner to unleash the full potential of your pet business!",
        ],
        [
          "PENDING",
          "Your application is pending review from our administrator staff. View your application",
        ],
      ])
    : new Map([
        [
          "REJECTED",
          "Your application has been rejected. " +
            (remarks.length > 0
              ? "Please see the latest remark: " + remarks[remarks.length - 1]
              : "[No remark available]"),
        ],
        ["APPROVED", "Your application has been approved!"],
        [
          "PENDING",
          "Your application is pending review from our administrator staff.",
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
      title={
        applicationStatus === "NOTFOUND" ? "Wait, don't go!" : applicationStatus
      }
      mb="md"
    >
      {messageMap.has(applicationStatus)
        ? messageMap.get(applicationStatus)
        : "An error has occured."}
      <div>{forDashboard && <>{ApplyButton}</>}</div>
    </Alert>
  );
};

export default ApplicationStatusAlert;
