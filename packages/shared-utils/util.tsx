import dayjs from "dayjs";
import { ServiceListing } from "./types";

export function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  if (!hasLetter || !hasDigit) {
    return "Password must contain at least 1 letter and 1 digit.";
  }

  if (/\s/.test(password)) {
    return "Password must not contain spaces.";
  }

  return null;
}

export function validateChangePassword(password: string, newPassword: string) {
  if (!password) {
    return "Please enter your new password.";
  }
  if (password === newPassword) {
    return "New password cannot be the same as current password.";
  }
  return validatePassword(newPassword);
}

export function formatISODateStringLongWithDay(dateString: string) {
  // e.g. Sat, 1 Sep 2023
  return dayjs(dateString).format("ddd, D MMM YYYY");
}

export function formatISODateStringLong(dateString: string) {
  // e.g. 1 September 2023
  return dayjs(dateString).format("D MMMM YYYY");
}

export function formatISODateStringDateOnly(dateString: string) {
  // e.g. 1/9/2023
  return dayjs(dateString).format("D/M/YYYY");
}

export function formatISODateStringTimeOnly(dateString: string) {
  // e.g. 4:00pm
  return dayjs(dateString).format("h:mma");
}

export function convertMinsToDurationString(mins: number) {
  const minutes = mins % 60;
  const hours = Math.floor(mins / 60);

  if (!minutes) {
    return `${hours}h`;
  }
  // e.g. 1h 30min
  return `${hours}h ${minutes}min`;
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

export function formatStringToLetterCase(enumString: string) {
  return enumString
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const formatEnumValueToLowerCase = (value: string) => {
  return value.replace(/_/g, " ").toLowerCase();
};

export function searchServiceListingsForPB(
  serviceListings: ServiceListing[],
  searchStr: string,
) {
  return serviceListings.filter((serviceListing: ServiceListing) => {
    const formattedCategory = formatEnumValueToLowerCase(
      serviceListing.category,
    );
    const formattedTags = serviceListing.tags.map((tag) =>
      tag.name.toLowerCase(),
    );
    return (
      serviceListing.title.toLowerCase().includes(searchStr.toLowerCase()) ||
      formattedCategory.includes(searchStr.toLowerCase()) ||
      formattedTags.some((tag) => tag.includes(searchStr.toLowerCase()))
    );
  });
}
