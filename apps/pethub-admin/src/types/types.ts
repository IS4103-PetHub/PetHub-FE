export interface PetOwner {
  petOwnerId: number;
  firstName: string;
  lastName: string;
  contactNumber: string;
  dateOfBirth: string;
  email: string;
  accountStatus: string;
  AccountTypeEnum: string;
}

export interface PetBusiness {
  AccountTypeEnum: string;
}

export interface InternalUser {
  AccountTypeEnum: string;
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
