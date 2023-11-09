import {
  AccountStatusEnum,
  AccountTypeEnum,
  Address,
  ArticleTypeEnum,
  PetBusinessTypeEnum,
  ServiceListing,
} from "shared-utils";

import {
  BusinessApplicationStatusEnum,
  InternalUserRoleEnum,
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
  businessEmail?: string;
  businessAddresses?: Address[];
  contactNumber: string;
  websiteURL?: string;
  commissionRule: CommissionRule;
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

export interface CreateInternalUserPayload {
  firstName: string;
  lastName: string;
  email: string;
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
  userGroupPermissions?: UserGroupPermission[];
  userGroupMemberships?: UserGroupMembership[];
}

export interface Permission {
  permissionId: number;
  code: string;
  name: string;
  description: string;
}

export interface CreateTagPayload {
  name: string;
}

export interface UpdateTagPayload {
  tagId: number;
  name: string;
}
export interface UserGroupPermission {
  groupId: number;
  permissionId: number;
  permission: Permission;
}

export interface UserGroupMembership {
  userId: number;
  groupId: number;
  user: {
    userId: number;
    email: string;
    accountType: AccountTypeEnum;
    accountStatus: AccountStatusEnum;
    dateCreated: string;
    lastUpdated?: string;
    internalUser: {
      firstName: string;
      lastName: string;
    };
  };
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
  petBusiness: PetBusiness;
}

export interface ApprovePetBusinessApplicationPayload {
  petBusinessApplicationId: Number;
  approverId: Number;
}

export interface RejectPetBusinessApplicationPayload {
  petBusinessApplicationId: Number;
  remark: String;
}

export interface CommissionRule {
  commissionRuleId: number;
  name: string;
  commissionRate: number;
  createdAt?: string;
  updatedAt?: string;
  petBusinesses?: PetBusiness[];
}

export interface RevenueDashboardSummary {
  totalTransactionAmount: number;
  totalCommissionEarned: number;
  last30DaysTransactionAmount: number;
  last30DaysCommissionEarned: number;
}

export interface RevenueDashboardPetBusiness {
  petBusinessId: number;
  totalAmount: number;
  totalCommission: number;
  orderItemCount: number;
  companyName: string;
  businessType: PetBusinessTypeEnum;
  userEmail: string;
  dateJoined: string;
}

export interface CreateOrUpdateArticlePayload {
  articleId?: number;
  title: string;
  content: string;
  articleType: ArticleTypeEnum;
  files: File[];
  internalUserId?: number;
  tagIds: number[];
  categories: string[];
  isPinned: boolean;
}
