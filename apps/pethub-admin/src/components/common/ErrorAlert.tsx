import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export const ErrorAlert = (classType: string) => {
  return (
    <Alert icon={<IconAlertCircle size="1rem" />} title="Oh no!" color="red">
      There was an error fetching the list of {classType}. Please try again
      later.
    </Alert>
  );
};
