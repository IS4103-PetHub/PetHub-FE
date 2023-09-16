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

export const enum AccountTypeEnum {
  PetOwner = "PET_OWNER",
  PetBusiness = "PET_BUSINESS",
  InternalUser = "INTERNAL_USER",
}

export const enum AccountStatusEnum {
  Pending = "PENDING",
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

export const enum InternalUserRoleEnum {
  admin = "ADMINISTRATOR",
}
