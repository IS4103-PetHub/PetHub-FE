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

export enum DayOfWeekEnum {
  Monday = "MONDAY",
  Tuesday = "TUESDAY",
  Wednesday = "WEDNESDAY",
  Thursday = "THURSDAY",
  Friday = "FRIDAY",
  Saturday = "SATURDAY",
  Sunday = "SUNDAY",
}

export enum RecurrencePatternEnum {
  Daily = "DAILY",
  Weekly = "WEEKLY",
}
