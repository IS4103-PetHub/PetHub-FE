export const enum AccountTypeEnum {
  PetOwner = "PET_OWNER",
  PetBusiness = "PET_BUSINESS",
  InternalUser = "INTERNAL_USER",
}

export const enum AccountStatusEnum {
  Pending = "PENDING",
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

export enum PetBusinessTypeEnum {
  Fnb = "FNB",
  Service = "SERVICE",
  Healthcare = "HEALTHCARE",
}

export const TABLE_PAGE_SIZE = 10;

// 500ms delay before the empty state message is shown
export const EMPTY_STATE_DELAY_MS = 500;

export enum ServiceCategoryEnum {
  PetGrooming = "PET_GROOMING",
  Dining = "DINING",
  Veterinary = "VETERINARY",
  PetRetail = "PET_RETAIL",
  PetBoarding = "PET_BOARDING",
}

export const enum BusinessApplicationStatusEnum {
  Notfound = "NOTFOUND",
  Pending = "PENDING",
  Rejected = "REJECTED",
  Approved = "APPROVED",
}

export enum GenderEnum {
  Male = "MALE",
  Female = "FEMALE",
}

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

export enum OrderItemStatusEnum {
  All = "ALL",
  PendingBooking = "PENDING_BOOKING",
  PendingFulfillment = "PENDING_FULFILLMENT",
  Fulfilled = "FULFILLED",
  PaidOut = "PAID_OUT",
  Refunded = "REFUNDED",
  Expired = "EXPIRED",
}

export enum RefundStatusEnum {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
  Cancelled = "CANCELLED",
}
