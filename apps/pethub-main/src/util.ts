import dayjs from "dayjs";
import { sortBy } from "lodash";
import { ServiceListing } from "shared-utils";
import { serviceListingSortOptions } from "./types/constants";

// Convert param to string
export function parseRouterQueryParam(param: string | string[] | undefined) {
  if (!param) {
    return null;
  }
  if (Array.isArray(param)) {
    param = param.join("");
  }
  return param;
}

export function validateAddressName(addressName: string) {
  if (!addressName) {
    return "Address name is required.";
  }
  if (addressName.length > 12) {
    return "Address name must be 12 characters or below.";
  }
  if (addressName.startsWith(" ") || addressName.endsWith(" ")) {
    return "Address name should not have leading or trailing spaces.";
  }

  return null;
}

export function validateWebsiteURL(url: string) {
  return !/^https?:\/\/.+\..+$/.test(url);
}

export function formatPriceForDisplay(num: number) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function searchServiceListingsForCustomer(
  serviceListings: ServiceListing[],
  searchStr: string,
) {
  return serviceListings.filter(
    (serviceListing: ServiceListing) =>
      serviceListing.title.toLowerCase().includes(searchStr.toLowerCase()) ||
      serviceListing.petBusiness?.companyName
        .toLowerCase()
        .includes(searchStr.toLowerCase()),
  );
}

// sort service listings for customer view service listings
export function sortServiceListings(
  serviceListings: ServiceListing[],
  sortStatus: string,
) {
  let sorted: ServiceListing[] = serviceListings;
  if (!sortStatus) return sorted;

  const sortOption = serviceListingSortOptions.find(
    (x) => sortStatus === x.value,
  );
  sorted = sortBy(serviceListings, sortOption.attribute);
  if (sortOption.direction == "desc") {
    sorted.reverse();
  }
  return sorted;
}
