import {
  AccountStatusEnum,
  AccountTypeEnum,
  PetBusinessTypeEnum,
} from "shared-utils";
import {
  BusinessApplicationStatusEnum,
  GenderEnum,
  PetTypeEnum,
  ServiceCategoryEnum,
} from "./constants";

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

export interface Address {
  addressId?: string;
  addressName: string;
  line1: string;
  line2: string;
  postalCode: string;
  petBusinessId?: Number;
  petBusinessApplicationId?: Number;
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
  //pet business
  petBusinessId: number;
  petBusiness?: {
    companyName: string;
  };
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
  healthAttachment: File[];
  dateCreated: string;
  dateUpdated: string;
}
