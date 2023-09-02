export interface LoginCredentials {
  username: string;
  password: string;
  accountType: string;
}

export interface ForgotPasswordPayload {
  email: string;
}
