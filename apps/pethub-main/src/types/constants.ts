export enum ServiceCategoryEnum {
  PetGrooming = "PET_GROOMING",
  Dining = "DINING",
  Veterinary = "VETERINARY",
  PetRetail = "PET_RETAIL",
  PetBoarding = "PET_BOARDING",
}

export const TABLE_PAGE_SIZE = 15;

export const EMPTY_STATE_DELAY_MS = 500;
export const serviceListingSortOptions = [
  {
    value: "recent",
    label: "Recently added",
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
