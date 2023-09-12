import { Alert, Group, Loader } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export const errorAlert = (accountType: string) => {
  return (
    <Alert icon={<IconAlertCircle size="1rem" />} title="Oh No!" color="red">
      There was an error loading the list of {accountType}. Please try again
      later.
    </Alert>
  );
};

export const loader = () => {
  return (
    <>
      <div className="center-vertically">
        <Group position="center">
          <Loader size="xl" style={{ marginTop: "2rem" }} />
        </Group>
      </div>
    </>
  );
};
