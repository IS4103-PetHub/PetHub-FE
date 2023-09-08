export interface LoginCredentials {
  username: string;
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

export interface Address {
  name: string;
  line1: string;
  line2: string;
  postal: string;
  isDefault: boolean;
}
