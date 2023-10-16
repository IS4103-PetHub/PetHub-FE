import {
  AccountStatusEnum,
  AccountTypeEnum,
  BusinessApplicationStatusEnum,
  Address,
  PetBusinessTypeEnum,
  ServiceCategoryEnum,
  ServiceListing,
  GenderEnum,
  CommissionRule,
} from "shared-utils";
import { PetTypeEnum } from "./constants";

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
  commissionRule: CommissionRule;
}

export interface PetOwner extends User {
  // pet owner attributes
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  favouriteListings?: ServiceListing[];
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
  requiresBooking: boolean;
  defaultExpiryDays: number;
  lastPossibleDate: string;
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
  requiresBooking: boolean;
  defaultExpiryDays: number;
  lastPossibleDate: string;
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
 * Pet
 */

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

/*
 * Appointment Booking
 */

export interface Timeslot {
  calendarGroupId: number;
  timeSlotId: number;
  startTime: string;
  endTime: string;
  vacancies: number;
}

export interface Booking {
  bookingId: number;
  petOwnerId: number;
  dateCreated: string;
  lastUpdated?: string;
  startTime: string;
  endTime: string;
  timeSlotId: number;
  serviceListingId: number;
  serviceListing: ServiceListing;
  // pet owner and pet details (optional)
  petOwner?: PetOwner;
  petId?: number;
  pet?: Pet;
  // not yet implemented
  invoiceId?: number;
  transactionId?: number;
  orderItemId?: number;
}

export interface AddRemoveFavouriteServiceListingPayload {
  serviceListingId: number;
  userId: number;
}

export interface CartItem {
  cartItemId?: number; // Added to cart order, basically corresponds to date added
  serviceListing: ServiceListing;
  bookingSelection?: CartItemBookingSelection;
  quantity: number;
  isSelected: boolean;
}

export interface CartItemBookingSelection {
  petId?: number;
  petName?: string;
  calendarGroupId: number;
  serviceListingId: number;
  startTime: string;
  endTime: string;
}

export interface Cart {
  cartId?: number;
  cartItems: CartItem[];
  itemCount: number;
  userId: number;
  cartItemUserSelection: CartItem[];
}
