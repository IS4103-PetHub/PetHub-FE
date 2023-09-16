import {
  AccountStatusEnum,
  AccountTypeEnum,
  BusinessApplicationStatusEnum,
  InternalUserRoleEnum,
  PetBusinessTypeEnum,
} from "./constants";

export abstract class User {
  userId: number;

  // found in 'user' section of backend response
  email: string;
  accountType: AccountTypeEnum;
  accountStatus: AccountStatusEnum;
  dateCreated: string;
  lastUpdated?: string;
}

export interface PetOwner extends User {
  firstName: string;
  lastName: string;
  contactNumber: string;
  dateOfBirth: string;
}

export interface PetBusiness extends User {
  // pet business attributes
  companyName: string;
  uen: string;
  businessType?: string;
  businessDescription?: string;
  websiteURL?: string;
}

export interface InternalUser extends User {
  firstName: string;
  lastName: string;
  adminRole: InternalUserRoleEnum;
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string | null;
  newPassword: string;
}
export interface CreateInternalUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  adminRole: string;
  password: string;
}

export interface UpdateInternalUserPayload {
  userId: number;
  firstName: string;
  lastName: string;
  adminRole: string;
}

export interface CreateUserGroupPayload {
  name: string;
  description: string;
  permissionIds?: number[];
}

export interface UserGroup {
  groupId: number;
  name: string;
  description: string;
  permissions?: Permission[];
  userGroupMemberships?: any[];
}

export interface Permission {
  permissionId: number;
  code: string;
  name: string;
  description: string;
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

export interface ApprovePetBusinessApplicationPayload {
  petBusinessApplicationId: Number;
  approverId: Number;
}

export interface RejectPetBusinessApplicationPayload {
  petBusinessApplicationId: Number;
  remark: String;
}
