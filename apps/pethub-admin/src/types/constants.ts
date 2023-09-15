export const enum AccountTypeEnum {
  PetOwner = "PET_OWNER",
  PetBusiness = "PET_BUSINESS",
  InternalUser = "INTERNAL_USER",
}

export const enum AccountStatusEnum {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

export const enum InternalUserRoleEnum {
  admin = "ADMINISTRATOR",
}
export const TABLE_PAGE_SIZE = 15;

export enum PetBusinessTypeEnum {
  Fnb = "FNB",
  Service = "SERVICE",
  Healthcare = "HEALTHCARE",
}

export const enum BusinessApplicationStatusEnum {
  Notfound = "NOTFOUND",
  Pending = "PENDING",
  Rejected = "REJECTED",
  Approved = "APPROVED",
}
