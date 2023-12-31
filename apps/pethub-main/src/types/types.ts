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
  PetTypeEnum,
  Pet,
  OrderItem,
  ReviewReportReasonEnum,
  SupportTicketReason,
  Priority,
  PetOwner,
} from "shared-utils";
import { PetRequestTypeEnum } from "./constants";

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
  stripeAccountId?: string;
  petBusinessApplication: PetBusinessApplication;
  commissionRule: CommissionRule;
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
  stripeAccountId: string;
  businessDescription: string;
  businessAddresses: Address[];
  attachments: string[];
}

export interface PetBusinessApplication {
  petBusinessApplicationId: Number;
  businessType: PetBusinessTypeEnum;
  businessEmail: string;
  websiteURL?: string;
  stripeAccountId?: string;
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
  orderItemId: number;
  OrderItem?: OrderItem;
}

export interface AddRemoveFavouriteServiceListingPayload {
  serviceListingId: number;
  userId: number;
}

export interface CartItem {
  cartItemId?: number; // Added to cart order, basically corresponds to date added
  serviceListing: ServiceListing;
  quantity: number;
  isSelected: boolean;
}

export interface Cart {
  cartId?: number;
  cartItems: CartItem[];
  itemCount: number;
  userId: number;
}

export interface CheckoutSummary {
  itemCount: number;
  subtotal: number;
  gst: number;
  platformFee: number;
  total: number;
}

export interface CompleteOrderItemPayload {
  userId: number;
  voucherCode: string;
}

export interface CreateReviewPayload {
  orderItemId: number;
  title: string;
  comment: string;
  rating: number;
  files: File[];
}

export interface UpdateReviewPayload {
  reviewId: number;
  title: string;
  comment: string;
  rating: number;
  files: File[];
}

export interface CreateRefundRequestPayload {
  orderItemId: number;
  reason: string;
}

export interface ApproveOrRejectRefundRequestPayload {
  refundRequestId: number;
  comment: string;
}

export interface ReportReviewPayload {
  reviewId: number;
  reportReason: ReviewReportReasonEnum;
}

export interface ReplyReviewPayload {
  reviewId: number;
  reply: string;
}

export interface PetLostAndFound {
  petLostAndFoundId: number;
  title: string;
  description: string;
  requestType: PetRequestTypeEnum;
  lastSeenDate: string;
  lastSeenLocation: string;
  attachmentKeys: string[];
  attachmentURLs: string[];
  contactNumber: string;
  userId: number;
  petOwner?: PetOwner;
  petId?: number;
  pet?: Pet;
  dateCreated: string;
  dateUpdated?: string;
  isResolved: boolean;
}

export interface CreatePetLostAndFoundPayload {
  title: string;
  description: string;
  requestType: PetRequestTypeEnum;
  lastSeenDate: string;
  lastSeenLocation: string;
  contactNumber: string;
  file: File;
  petOwnerId: number;
  petId: string;
}

export interface UpdatePetLostAndFoundPayload {
  petLostAndFoundId: number;
  title: string;
  description: string;
  requestType: PetRequestTypeEnum;
  lastSeenDate: string;
  lastSeenLocation: string;
  contactNumber: string;
  file: File;
  petId: string;
  isResolved: boolean;
}

export interface FeaturedServiceListing extends ServiceListing {
  id: number;
  featuredListingSetId: number;
  description: string;
}

export interface SalesDashboardSummary {
  totalNumOrders: number;
  totalSales: number;
  last30DaySales: number;
  mostSalesDate: string;
  mostSalesAmount: number;
}

export interface SalesDashboardServiceListing {
  serviceListingId: number;
  title: string;
  category: ServiceCategoryEnum;
  totalOrders: number;
  totalSales: number;
}

export interface UserDemographicData {
  POCount: number;
  PBCount: number;
  ReportedReviewCount: number;
  PBApplicationCount: number;
}

export interface PbDashboardData {
  unrepliedReviewCount: number;
  remainingAppointments: number;
  invalidSLCount: number;
  openRefundRequestsCount: number;
  openSupportRequestsCount: number;
}

export interface CreateUpdateArticleCommentPayload {
  articleId?: number;
  articleCommentId?: number;
  comment: string;
}

export interface CheckoutCartPayload {
  paymentMethodId: string;
  totalPrice: number;
  userId: number;
  pointsRedeemed: number;
  // serviceListingId, quantity
  cartItems: any[];
}

export interface CheckoutSpotlightListingPayload {
  serviceListingId: number;
  paymentMethodId: string;
}

export interface createSupportTicketPayload {
  userId: number;
  supportCategory: SupportTicketReason;
  priority: Priority;
  reason: string;
  files: File[];
  serviceListingId?: number;
  orderItemId?: number;
  bookingId?: number;
  payoutInvoiceId?: number;
  refundRequestId?: number;
}

export interface commentSupportPayload {
  userId: number;
  comment: string;
  files: File[];
}
