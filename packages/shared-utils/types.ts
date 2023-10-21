import {
  AccountStatusEnum,
  AccountTypeEnum,
  GenderEnum,
  OrderItemStatusEnum,
  PetTypeEnum,
  RecurrencePatternEnum,
  ServiceCategoryEnum,
} from "./constants";

export interface ChangePasswordPayload {
  email: string;
  password: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string | null;
  newPassword: string;
}

export interface VerifyEmailPayload {
  token: string | null;
}

export interface ResendVerifyEmailPayload {
  email: string;
}

export interface Tag {
  tagId: number;
  name: string;
  dateCreated: string;
  lastUpdated?: string;
}

export interface Address {
  addressId?: number;
  addressName: string;
  line1: string;
  line2: string;
  postalCode: string;
  petBusinessId?: Number;
  petBusinessApplicationId?: Number;
}

export interface TimePeriod {
  timePeriodId?: number;
  startTime: string;
  endTime: string;
  vacancies: number;
  bookingId?: number;
  calenderGroupId?: number;
}
export interface Recurrence {
  pattern: RecurrencePatternEnum;
  startDate: string;
  endDate: string;
  timePeriods: TimePeriod[];
}

export interface ScheduleSettings {
  scheduleSettingsId?: number;
  days: string[];
  recurrence: Recurrence;
}

export interface CalendarGroup {
  calendarGroupId?: number;
  name: string;
  description: string;
  petBusinessId?: number;
  scheduleSettings: ScheduleSettings[];
}

export interface ServiceListing {
  serviceListingId: number;
  title: string;
  description: string;
  basePrice: number;
  category: ServiceCategoryEnum;
  tags: Tag[];
  // address
  dateCreated: string;
  lastUpdated?: string;
  attachmentKeys: string[];
  attachmentURLs: string[];
  addresses: Address[];
  //pet business
  petBusinessId: number;
  // leave as any because the response varies from BE
  petBusiness?: any;
  // appointment booking
  CalendarGroup?: CalendarGroup;
  calendarGroupId?: number;
  duration?: number;
  // New fields from new flow
  defaultExpiryDays: number;
  lastPossibleDate?: string;
  requiresBooking: boolean;
}
export interface OrderItem {
  orderItemId: number;
  itemName: string;
  itemPrice: number;
  status: OrderItemStatusEnum;
  expiryDate?: string;
  voucherCode: string;
  invoiceId: number;
  invoice: {
    paymentId: string;
    createdAt: string;
    PetOwner: {
      firstName: string;
      lastName: string;
      contactNumber: string;
      dateOfBirth: string;
      userId: number;
      user: {
        email: string;
      };
    };
  };
  serviceListingId: number;
  serviceListing: ServiceListing;
  addresses: Address[];
  tags: Tag[];
  bookingId?: number;
  booking?: {
    bookingId: number;
    dateCreated: string;
    lastUpdated: string;
    startTime: string;
    endTime: string;
    petOwnerId: number;
    petId: number;
    timeSlotId: number;
    serviceListingId?: number;
    orderItemId?: number;
  };
  attachmentKey: string;
  attachmentURL: string;
  commissionRate: number;
  dateFulfilled?: string;
}

export interface OrderBarCounts {
  allCount: number;
  toBookCount: number;
  toFulfillCount: number;
  fulfilledCount: number;
  expiredCount: number;
  refundedCount: number;
}

export interface Invoice {
  invoiceId: number;
  totalPrice: number;
  commissionRate: number;
  createdAt: string;
  paymentId: string;
  miscCharge: number;
  orderItems: OrderItem[];
  petOwnerUserId: number;
  serviceListingServiceListingId?: number;
  attachmentKey: string;
  attachmentURL: string;
}

export interface RefundRequest {
  refundRequestId: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  reason?: string;
  processedAt?: string;
  petOwnerId: number;
  orderId: number;
  order: Invoice;
  petBusinessId: number;
}

export interface CommissionRule {
  commissionRuleId: number;
  name: string;
  commissionRate: number;
  default: boolean;
  createdAt: string;
  updatedAt: string;
  petBusinesses: any[];
}

// User
export abstract class User {
  userId: number;
  contactNumber: string;

  // found in 'user' section of backend response
  email: string;
  accountType: AccountTypeEnum;
  accountStatus: AccountStatusEnum;
  dateCreated: string;
  lastUpdated?: string;
}

export interface PetOwner extends User {
  // pet owner attributes
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  favouriteListings?: ServiceListing[];

  user?: User; // BE not flattening for some endpoints
}

export interface Pet {
  petId: number;
  petName: string;
  petType: PetTypeEnum;
  gender: GenderEnum;
  petWeight?: number;
  dateOfBirth?: string;
  microchipNumber?: string;
  attachmentKeys: string[];
  attachmentURLs: string[];
  dateCreated: string;
  dateUpdated: string;
}
