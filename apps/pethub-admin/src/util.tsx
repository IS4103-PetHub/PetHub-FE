/*
  Validate a password string to be at least 8 characters long, contain at least 1 letter and 1 digit, and not contain spaces
*/
export function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  if (!hasLetter || !hasDigit) {
    return "Password must contain at least 1 letter and 1 digit";
  }

  if (/\s/.test(password)) {
    return "Password must not contain spaces";
  }

  return null;
}

/*
  Convert Next.js's router.param value to either be a string or null
*/
export function parseRouterQueryParam(param: string | string[] | undefined) {
  if (!param) {
    return null;
  }
  if (Array.isArray(param)) {
    param = param.join("");
  }
  return param;
}

export function formatEnumToLetterCase(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatEnumValue(value: string) {
  return value.replace(/_/g, " ").toLowerCase();
}

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
