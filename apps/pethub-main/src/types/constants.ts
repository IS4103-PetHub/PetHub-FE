export const enum AccountTypeEnum {
  PetOwner = "PET_OWNER",
  PetBusiness = "PET_BUSINESS",
  InternalUser = "INTERNAL_USER",
}

export enum PetBusinessTypeEnum {
  Fnb = "FNB",
  Service = "SERVICE",
  Healthcare = "HEALTHCARE",
}

export const enum AccountStatusEnum {
  Pending = "PENDING",
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Suspended = "SUSPENDED",
}

export const enum BusinessApplicationStatusEnum {
  Notfound = "NOTFOUND",
  Pending = "PENDING",
  Rejected = "REJECTED",
  Approved = "APPROVED",
}

export enum ServiceCategoryEnum {
  PetGrooming = "PET_GROOMING",
  Dining = "DINING",
  Veterinary = "VETERINARY",
  PetRetail = "PET_RETAIL",
  PetBoarding = "PET_BOARDING",
}

export const TABLE_PAGE_SIZE = 15;

export const EMPTY_STATE_DELAY_MS = 500;
