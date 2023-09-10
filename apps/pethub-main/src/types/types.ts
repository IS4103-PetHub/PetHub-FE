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
  uen: string;
  contactNumber: string;
  email: string;
  password: string;
}
