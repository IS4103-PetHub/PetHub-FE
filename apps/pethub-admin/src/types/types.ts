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

export interface UserGroup {
  groupId: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  permissionId: number;
  code: string;
  name: string;
  description: string;
}
