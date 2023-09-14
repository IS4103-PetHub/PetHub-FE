import { AccountStatusEnum, AccountTypeEnum } from "./constants";

export interface LoginCredentials {
  email: string;
  password: string;
  accountType: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string | null;
  newPassword: string;
}

export interface ChangePasswordPayload {
  email: string;
  password: string;
  newPassword: string;
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
}

export interface PetOwner extends User {
  // pet owner attributes
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface Address {
  name: string;
  line1: string;
  line2: string;
  postal: string;
  isDefault: boolean;
}
