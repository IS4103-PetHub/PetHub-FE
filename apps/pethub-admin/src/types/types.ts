import { AccountStatusEnum, AccountTypeEnum } from "./constants";

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
  userGroupPermissions?: UserGroupPermission[];
  userGroupMemberships?: UserGroupMembership[];
}

export interface Permission {
  permissionId: number;
  code: string;
  name: string;
  description: string;
}

export interface UserGroupPermission {
  groupId: number;
  permissionId: number;
  permission: Permission;
}

export interface UserGroupMembership {
  userId: number;
  groupId: number;
  user: {
    userId: number;
    email: string;
    accountType: AccountTypeEnum;
    accountStatus: AccountStatusEnum;
    dateCreated: string;
    lastUpdated?: string;
  };
}
