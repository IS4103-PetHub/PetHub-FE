export const enum BusinessApplicationStatusEnum {
  Notfound = "NOTFOUND",
  Pending = "PENDING",
  Rejected = "REJECTED",
  Approved = "APPROVED",
}

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

export enum PetTypeEnum {
  Dog = "DOG",
  Cat = "CAT",
  Bird = "BIRD",
  Terrapin = "TERRAPIN",
  Rabbit = "RABBIT",
  Rodent = "RODENT",
  Others = "OTHERS",
}

export enum GenderEnum {
  Male = "MALE",
  Female = "FEMALE",
}
