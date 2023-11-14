import {
  IconList,
  IconBuildingCommunity,
  IconCut,
  IconStethoscope,
  IconToolsKitchen2,
  IconShoppingBag,
} from "@tabler/icons-react";
import { ServiceCategoryEnum } from "shared-utils";

export const serviceListingSortOptions = [
  {
    value: "recent",
    label: "Recently added",
    attribute: "listingTime",
    direction: "desc",
  },
  {
    value: "oldest",
    label: "Oldest",
    attribute: "listingTime",
    direction: "asc",
  },
  {
    value: "priceLowToHigh",
    label: "Price (low to high)",
    attribute: "basePrice",
    direction: "asc",
  },
  {
    value: "priceHighToLow",
    label: "Price (high to low)",
    attribute: "basePrice",
    direction: "desc",
  },
];

export const bookingsSortOptions = [
  {
    value: "earliest",
    label: "Earliest",
    attribute: "startTime",
    direction: "asc",
  },
  {
    value: "furthest",
    label: "Furthest",
    attribute: "startTime",
    direction: "desc",
  },
];

export const orderItemsSortOptions = [
  {
    value: "recent",
    label: "Most recent",
    attribute: "dateCreated",
    direction: "desc",
  },
  {
    value: "oldest",
    label: "Oldest",
    attribute: "dateCreated",
    direction: "asc",
  },
];

// for landing page and service listings sidebar

export const landingPageCategories = [
  {
    icon: IconBuildingCommunity,
    value: ServiceCategoryEnum.PetBoarding,
    label: "Pet boarding",
  },
  {
    icon: IconCut,
    value: ServiceCategoryEnum.PetGrooming,
    label: "Pet grooming",
  },
  {
    icon: IconStethoscope,
    value: ServiceCategoryEnum.Veterinary,
    label: "Veterinary",
  },
  {
    icon: IconToolsKitchen2,
    value: ServiceCategoryEnum.Dining,
    label: "Dining",
  },
  {
    icon: IconShoppingBag,
    value: ServiceCategoryEnum.PetRetail,
    label: "Pet retail",
  },
];

export const serviceListingSideBarCategories = [
  { icon: IconList, value: "", label: "All" },
  ...landingPageCategories,
];

export const allowedRoutesAfterLogin = [
  "/customer/appointments",
  "/customer/account",
  "/customer/orders",
  "/customer/cart",
  "/customer/favourites",
  "/business/application",
  "/business/appointments",
  "/business/listings",
];

export const GST_PERCENT = 0.08;

export const PLATFORM_FEE_MESSAGE: string =
  "The platform fee covers operational costs to help keep PetHub up and running. PetHub strives to deliver a smooth and pleasant experience for all users.";

export enum PetRequestTypeEnum {
  LostPet = "LOST_PET",
  FoundPet = "FOUND_PET",
}

export const petLostAndFoundSortOptions = [
  {
    value: "newest",
    label: "Newest",
    attribute: "dateCreated",
    direction: "desc",
  },
  {
    value: "oldest",
    label: "Oldest",
    attribute: "dateCreated",
    direction: "asc",
  },
  {
    value: "recently_spotted",
    label: "Recently spotted",
    attribute: "last",
    direction: "asc",
  },
];
