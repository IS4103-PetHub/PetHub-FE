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
export const TABLE_PAGE_SIZE = 10;

// 500ms delay before the empty state message is shown
export const EMPTY_STATE_DELAY_MS = 500;

export enum PetBusinessTypeEnum {
  Fnb = "FNB",
  Service = "SERVICE",
  Healthcare = "HEALTHCARE",
}

export const enum BusinessApplicationStatusEnum {
  All = "ALL",
  Notfound = "NOTFOUND",
  Pending = "PENDING",
  Rejected = "REJECTED",
  Approved = "APPROVED",
}

export const enum PermissionsCodeEnum {
  // right side is permissions code
  WriteInternalUsers = "WRITE_INTERNAL_USERS",
  ReadInternalUsers = "READ_INTERNAL_USERS",
  WritePetOwners = "WRITE_PET_OWNERS",
  ReadPetOwners = "READ_PET_OWNERS",
  WritePetBusinesses = "WRITE_PET_BUSINESSES",
  ReadPetBusinesses = "READ_PET_BUSINESSES",
  WriteRbac = "WRITE_RBAC",
  ReadRbac = "READ_RBAC",
  WriteTags = "WRITE_TAGS",
  ReadTags = "READ_TAGS",
  WritePBApplications = "WRITE_PET_BUSINESS_APPLICATIONS",
  ReadPBApplications = "READ_PET_BUSINESS_APPLICATIONS",
}

export enum ServiceCategoryEnum {
  PetGrooming = "PET_GROOMING",
  Dining = "DINING",
  Veterinary = "VETERINARY",
  PetRetail = "PET_RETAIL",
  PetBoarding = "PET_BOARDING",
}
