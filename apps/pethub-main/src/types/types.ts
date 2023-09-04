import { AccountTypeEnum } from "./constants";

export interface CreatePetOwnerRequest {
  firstName: string;
  lastName: string;
  contactNumber: string;
  dateOfBirth: string;
  email: string;
  password: string;
}

export interface CreatePetBusinessRequest {
  companyName: string;
  contactNumber: string;
  email: string;
  password: string;
}

export interface UserAccount {
  accountId: string;
  accountType: AccountTypeEnum;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  contactNumber: string;
  dateOfBirth?: string;
  email: string;
}
