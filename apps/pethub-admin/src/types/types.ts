// export interface PetOwner {
//   petOwnerId: number;
//   firstName: string;
//   lastName: string;
//   contactNumber: string;
//   dateOfBirth: string;
//   email: string;
//   accountStatus: string;
//   AccountTypeEnum: string;
// }

export interface PetOwner {
  firstName: string;
  lastName: string;
  contactNumber: string;
  dateOfBirth: string;
  userId: number;
  email: string;
  accountType: string;
  accountStatus: string;
  dateCreated: string;
  lastUpdated: string;
}

export interface PetBusiness {
  accountType: string;
}

export interface InternalUser {
  accountType: string;
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
