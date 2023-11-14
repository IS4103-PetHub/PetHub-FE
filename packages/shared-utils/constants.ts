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
}

export enum PetTypeEnum {
  Dog = "DOG",
  Cat = "CAT",
  Bird = "BIRD",
  Terrapin = "TERRAPIN",
  Rabbit = "RABBIT",
  Rodent = "RODENT",
  Others = "OTHERS",
}

export enum ReviewReportReasonEnum {
  RudeOrAbusive = "RUDE_ABUSIVE",
  Pornographic = "PORNOGRAPHIC",
  Spam = "SPAM",
  ExposingPersonalInformation = "EXPOSING_PERSONAL_INFORMATION",
  UnauthorizedAdvertisement = "UNAUTHORIZED_ADVERTISEMENT",
  InaccurateOrMisleading = "INACCURATE_MISLEADING",
  Others = "OTHERS",
}

export enum SupportTicketReason {
  GeneralEnquiry = "GENERAL_ENQUIRY",
  ServiceListing = "SERVICE_LISTINGS",
  Orders = "ORDERS",
  Appointments = "APPOINTMENTS",
  Payments = "PAYMENTS",
  Accounts = "ACCOUNTS",
  Refunds = "REFUNDS",
  Others = "OTHERS",
}

export enum Priority {
  High = "HIGH",
  Medium = "MEDIUM",
  Low = "LOW",
}

export enum SupportTicketStatus {
  Pending = "PENDING",
  InProgress = "IN_PROGRESS",
  ClosedResolved = "CLOSED_RESOLVED",
  ClosedUnresolved = "CLOSED_UNRESOLVED",
}

export const PLATFORM_FEE_PERCENT = 0.07;

export const COST_PER_SPOTLIGHT = 5;
