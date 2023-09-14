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

export interface CreateUserGroupPayload {
  name: string;
  description: string;
  permissionIds?: number[];
}

export interface UserGroup {
  groupId: number;
  name: string;
  description: string;
  userGroupPermissions?: Permission[];
  userGroupMemberships?: any[];
}

export interface Permission {
  groupId?: number;
  permissionId: number;
  code: string;
  name: string;
  description: string;
}
