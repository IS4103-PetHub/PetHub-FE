import { RecurrencePatternEnum, ServiceCategoryEnum } from "./constants";

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

export interface Tag {
  tagId: number;
  name: string;
  dateCreated: string;
  lastUpdated?: string;
}

export interface Address {
  addressId?: string;
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
}
