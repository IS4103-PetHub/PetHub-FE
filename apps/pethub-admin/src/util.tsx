import { Alert, Group, Loader } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import {
  InternalUser,
  PetBusiness,
  PetBusinessApplication,
  PetOwner,
} from "./types/types";

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

/*
  Search helpers for INTERNAL USER, PET BUSINESS, PET OWNER, PB APPLICATION
*/

export function searchInternalUsers(
  internalUsers: InternalUser[],
  searchStr: string,
) {
  return internalUsers.filter(
    (internalUser: InternalUser) =>
      internalUser.firstName.toLowerCase().includes(searchStr.toLowerCase()) ||
      internalUser.lastName.toLowerCase().includes(searchStr.toLowerCase()) ||
      internalUser.email.toLowerCase().includes(searchStr.toLowerCase()) ||
      (internalUser.userId &&
        searchStr.includes(internalUser.userId.toString()) &&
        searchStr.length <= internalUser.userId.toString().length),
  );
}

export function searchPetBusinesses(
  petBusinesses: PetBusiness[],
  searchStr: string,
) {
  return petBusinesses.filter(
    (petBusiness: PetBusiness) =>
      petBusiness.companyName.toLowerCase().includes(searchStr.toLowerCase()) ||
      (petBusiness.uen &&
        searchStr.includes(petBusiness.uen.toString()) &&
        searchStr.length <= petBusiness.uen.toString().length) ||
      petBusiness.email.toLowerCase().includes(searchStr.toLowerCase()) ||
      (petBusiness.userId &&
        searchStr.includes(petBusiness.userId.toString()) &&
        searchStr.length <= petBusiness.userId.toString().length),
  );
}

export function searchPetOwners(petOwners: PetOwner[], searchStr: string) {
  return petOwners.filter(
    (petOwner: PetOwner) =>
      petOwner.firstName.toLowerCase().includes(searchStr.toLowerCase()) ||
      petOwner.lastName.toLowerCase().includes(searchStr.toLowerCase()) ||
      petOwner.email.toLowerCase().includes(searchStr.toLowerCase()) ||
      (petOwner.userId &&
        searchStr.includes(petOwner.userId.toString()) &&
        searchStr.length <= petOwner.userId.toString().length),
  );
}

export function searchPBApplications(
  applications: PetBusinessApplication[],
  searchStr: string,
) {
  return applications.filter((application: PetBusinessApplication) => {
    const formattedBusinessType = formatEnumValue(application.businessType);
    return (
      application.petBusiness.companyName
        .toLowerCase()
        .includes(searchStr.toLowerCase()) ||
      (application.petBusiness.uen &&
        searchStr.includes(application.petBusiness.uen.toString()) &&
        searchStr.length <= application.petBusiness.uen.toString().length) ||
      formattedBusinessType.includes(searchStr.toLowerCase()) ||
      (application.petBusinessApplicationId &&
        searchStr.includes(application.petBusinessApplicationId.toString()) &&
        searchStr.length <=
          application.petBusinessApplicationId.toString().length)
    );
  });
}

// for tables inside pages that have variable length
export function getMinTableHeight(records?: any[]) {
  if (!records || records.length === 0) {
    return 150;
  }
  // to account for pagination
  if (records.length >= 10) {
    return 560;
  }
  // 1 record to 9 records
  if (records.length > 0) {
    return 100;
  }
}
