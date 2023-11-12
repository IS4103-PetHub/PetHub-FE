import { IconX } from "@tabler/icons-react";
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

export function formatISOLongWithDay(dateString: string) {
  // e.g. Sat, 1 Sep 2023
  return dayjs(dateString).format("ddd, D MMM YYYY");
}

export function formatISODayOnly(dateString: string) {
  // e.g. Sat
  return dayjs(dateString).format("ddd");
}

export function formatISODateLong(dateString: string) {
  // e.g. 1 September 2023
  return dayjs(dateString).format("D MMMM YYYY");
}

export function formatISODateOnly(dateString: string) {
  // e.g. 1/9/2023
  return dayjs(dateString).format("DD-MM-YYYY");
}

export function formatISOTimeOnly(dateString: string) {
  // e.g. 4:00pm
  return dayjs(dateString).format("h:mma");
}

export function formatISODayDateTime(dateString: string) {
  // e.g. Sat
  return dayjs(dateString).format("ddd DD-MM-YYYY h:mma");
}

export function formatISODateTimeShort(dateString: string) {
  // e.g. 14-09-2023 21:10
  return dayjs(dateString).format("DD-MM-YYYY HH:mm");
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

export function getErrorMessageProps(title: string, error: any) {
  return {
    title: title,
    color: "red",
    icon: <IconX />,
    autoClose: 5000,
    message:
      (error.response && error.response.data && error.response.data.message) ||
      error.message,
  };
}

export function formatStringToLetterCase(enumString: string) {
  return enumString
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatLetterCaseToEnumString(str: string) {
  return str.replace(/\s+/g, "_").toUpperCase();
}

export const formatEnumValueToLowerCase = (value: string) => {
  return value.replace(/_/g, " ").toLowerCase();
};

export function formatNumberCustomDecimals(num: number, precision: number) {
  // use this instead of toFixed() alone to avoid rounding errors e.g. 1.005 should round to 1.01 not 1.00
  // returns a formatted string
  return Number(
    Math.round(parseFloat(num + "e" + precision)) + "e-" + precision,
  ).toFixed(precision);
}

export function formatNumber2Decimals(num: number) {
  return formatNumberCustomDecimals(num, 2);
}

export function searchServiceListingsForPB(
  serviceListings: ServiceListing[],
  searchStr: string,
) {
  return serviceListings.filter((serviceListing: ServiceListing) => {
    const search = searchStr.toLowerCase();
    const formattedCategory = formatEnumValueToLowerCase(
      serviceListing.category,
    );
    const formattedTags = serviceListing.tags.map((tag) =>
      tag.name.toLowerCase(),
    );
    return (
      serviceListing.title.toLowerCase().includes(search) ||
      formattedCategory.includes(search) ||
      formattedTags.some((tag) => tag.includes(search))
    );
  });
}

export function sortInvalidServiceListings(serviceListings: ServiceListing[]) {
  return serviceListings.sort((a, b) =>
    (a.requiresBooking ? a.calendarGroupId && a.duration : true) &&
    (a.lastPossibleDate ? new Date(a.lastPossibleDate) > new Date() : true)
      ? 1
      : -1,
  );
}

export function isValidServiceListing(serviceListing: ServiceListing) {
  return (
    (serviceListing.requiresBooking
      ? serviceListing.calendarGroupId && serviceListing.duration
      : true) &&
    (serviceListing.lastPossibleDate
      ? new Date(serviceListing.lastPossibleDate) > new Date()
      : true)
  );
}

export function generateRandomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// handling file download and file name extraction
export const downloadFile = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return new File([buffer], fileName);
  } catch (error) {
    console.log("Error:", error);
  }
};

export const extractFileName = (attachmentKeys: string) => {
  return attachmentKeys.substring(attachmentKeys.lastIndexOf("-") + 1);
};

export function validateReviewTitle(title: string) {
  if (!title) {
    return "Title is required.";
  }
  if (title.length > 64) {
    return "Title cannot exceed 64 characters";
  }
  return null;
}

export function validateReviewComment(comment: string) {
  if (!comment) {
    return "Comment is required.";
  }
  if (comment.length > 2000) {
    return "Title cannot exceed 2000 characters";
  }
  return null;
}

export function validateReviewRating(rating: number) {
  if (!rating) {
    return "Rating is required.";
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5 stars inclusive.";
  }
  return null;
}

export function validateReviewFiles(files: string[]) {
  if (files.length > 3) {
    return "Maximum of 3 images allowed";
  }
  return null;
}

// If < 1 hour: "recently posted", if < 24 hours: "x hours ago", if < 7 days, x days ago, else "DD-MM-YYYY-TT"
export function displayArticleDate(dateCreated) {
  if (!dateCreated) return "";

  const createdDate = dayjs(dateCreated);
  const now = dayjs();

  const hoursDiff = now.diff(createdDate, "hour");
  const daysDiff = now.diff(createdDate, "day");

  if (hoursDiff < 1) {
    return "Recently posted";
  } else if (hoursDiff >= 1 && hoursDiff < 24) {
    return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`;
  } else if (daysDiff >= 1 && daysDiff < 7) {
    return `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`;
  } else {
    return formatISODayDateTime(dateCreated);
  }
}
