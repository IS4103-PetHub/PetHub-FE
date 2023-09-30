import {
  AccountStatusEnum,
  AccountTypeEnum,
  BusinessApplicationStatusEnum,
  DayOfWeekEnum,
  Address,
  PetBusinessTypeEnum,
  RecurrencePatternEnum,
  ServiceCategoryEnum,
} from "shared-utils";
import { GenderEnum, PetTypeEnum } from "./constants";

/*
 * USER MANAGEMENT
 */
export interface LoginCredentials {
  email: string;
  password: string;
  accountType: string;
}

export interface CreatePetOwnerPayload {
  firstName: string;
  lastName: string;
  contactNumber: string;
  dateOfBirth: string;
  email: string;
  password: string;
}

export interface CreatePetBusinessPayload {
  companyName: string;
  uen: string;
  contactNumber: string;
  email: string;
  password: string;
}

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

export interface PetBusiness extends User {
  // pet business attributes
  companyName: string;
  uen: string;
  businessType?: string;
  businessDescription?: string;
  websiteURL?: string;
  businessAddresses?: Address[];
  businessEmail?: string;
  petBusinessApplication: PetBusinessApplication;
}

export interface PetOwner extends User {
  // pet owner attributes
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface BusinessApplicationApprover {
  firstName: String;
  lastName: String;
  adminRole: String;
  userId: Number;
}

export interface CreatePetBusinessApplicationPayload {
  petBusinessApplicationId?: Number;
  petBusinessId: Number;
  businessType: PetBusinessTypeEnum;
  businessEmail: string;
  websiteURL?: string;
  businessDescription: string;
  businessAddresses: Address[];
  attachments: string[];
}

export interface PetBusinessApplication {
  petBusinessApplicationId: Number;
  businessType: PetBusinessTypeEnum;
  businessEmail: string;
  websiteURL?: string;
  businessDescription: string;
  businessAddresses: Address[];
  attachments: string[];
  applicationStatus: BusinessApplicationStatusEnum;
  adminRemarks: string[];
  dateCreated: string;
  lastUpdated?: string;
  petBusinessId: Number;
  approverId?: Number;
  approver?: BusinessApplicationApprover;
}

/*
 * SERVICE MANAGEMENT
 */
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
  CalendarGroup: CalendarGroup;
  calendarGroupId: number;
  duration: number;
}

export interface Tag {
  tagId: number;
  name: string;
  dateCreated: string;
  lastUpdated?: string;
}

export interface CreateServiceListingPayload {
  title: string;
  description: string;
  petBusinessId: number;
  category: ServiceCategoryEnum;
  basePrice: number;
  // address
  tagIds: number[];
  files: File[];
  addressIds: number[];
  calendarGroupId: number;
  duration: number;
}

export interface UpdateServiceListingPayload {
  serviceListingId: number;
  title: string;
  description: string;
  category: ServiceCategoryEnum;
  basePrice: number;
  // address
  tagIds: number[];
  files: File[];
  addressIds: number[];
  calendarGroupId: number;
  duration: number;
}

/*
 * TUI Calendar
 */

export interface tuiEvent {
  id: string;
  title: string;
  calendarId: string;
  start: string; // ISO FORMAT
  end: string; // ISO FORMAT
}

export interface tuiCalendar {
  id: string;
  name: string;
  backgroundColor: string;
  borderColor: string;
}

/*
 * Booking
 */

export interface BookingResponse {
  id: number;
  invoiceId: number;
  transactionId: number;
  petOwnerId: number;
  dateCreated: string;
  lastUpdated: string;
  startTime: string;
  endTime: string;
  serviceListing: ServiceListingBooking;
  timeSlot: Timeslot;
  petOwner: PetOwner;
}

export interface ServiceListingBooking {
  id: number;
  title: string;
  description: string;
  basePrice: number;
  attachmentKeys: string[];
  attachmentURLs: string[];
  dateCreated: string;
  lastUpdated: string;
  category: ServiceCategoryEnum;
  tags: Tag[];
  addresses: Address[];
  petBusinessId: number;
  calendarGroupId: number;
}

export interface CalendarGroup {
  calendarGroupId?: number;
  name: string;
  description: string;
  timeslots: Timeslot[];
  petBusinessId?: number;
  scheduleSettings: ScheduleSettings[];
}

export interface ScheduleSettings {
  scheduleSettingsId?: number;
  days: string[];
  startTime: string;
  endTime: string;
  vacancies: number;
  pattern: RecurrencePatternEnum;
  startDate: string;
  endDate: string;
  timeslots: Timeslot[];
}

export interface Timeslot {
  timeslotId: number;
  startTime: string;
  endTime: string;
  isVacant: boolean;
  calenderGroupId: number;
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

export interface PetPayload {
  petId: number;
  petOwnerId: number;
  petName: string;
  petType: PetTypeEnum;
  gender: GenderEnum;
  petWeight: number;
  dateOfBirth: string;
  microchipNumber: string;
  files: File[];
  dateCreated: string;
  dateUpdated: string;
}
export interface CalendarGroup {
  calendarGroupId?: number;
  name: string;
  description: string;
  petBusinessId?: number;
  scheduleSettings: ScheduleSettings[];
}

export interface TimePeriod {
  timePeriodId?: number;
  startTime: string;
  endTime: string;
  vacancies: number;
  bookingId?: number;
  calenderGroupId?: number;
}

export interface ScheduleSettings {
  scheduleSettingsId?: number;
  days: string[];
  recurrence: Recurrence;
}

export interface Recurrence {
  pattern: RecurrencePatternEnum;
  startDate: string;
  endDate: string;
  timePeriods: TimePeriod[];
}

export interface Booking {
  bookingId: number;
  petOwnerId: number;
  invoiceId?: number;
  transactionId?: number;
  dateCreated: string;
  lastUpdated?: string;
  timeSlotIds: number[];
}
