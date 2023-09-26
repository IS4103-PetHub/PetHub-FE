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

export enum PetBusinessTypeEnum {
  Fnb = "FNB",
  Service = "SERVICE",
  Healthcare = "HEALTHCARE",
}

export const TABLE_PAGE_SIZE = 10;

// 500ms delay before the empty state message is shown
export const EMPTY_STATE_DELAY_MS = 500;
