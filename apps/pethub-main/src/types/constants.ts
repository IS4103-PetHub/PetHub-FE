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

export enum PetTypeEnum {
  Dog = "DOG",
  Cat = "CAT",
  Bird = "BIRD",
  Terrapin = "TERRAPIN",
  Rabbit = "RABBIT",
  Rodent = "RODENT",
  Others = "OTHERS",
}

export enum GenderEnum {
  Male = "MALE",
  Female = "FEMALE",
}

export const TABLE_PAGE_SIZE = 15;

export const EMPTY_STATE_DELAY_MS = 500;
