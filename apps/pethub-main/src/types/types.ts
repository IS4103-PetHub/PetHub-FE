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
