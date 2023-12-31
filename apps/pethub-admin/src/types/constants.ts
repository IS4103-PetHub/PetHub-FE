export const enum InternalUserRoleEnum {
  admin = "ADMINISTRATOR",
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
  WriteServiceListings = "WRITE_SERVICE_LISTINGS",
  ReadServiceListings = "READ_SERVICE_LISTINGS",
  WriteCommissionRules = "WRITE_COMMISSION_RULES",
  ReadCommissionRules = "READ_COMMISSION_RULES",
  WriteOrderItems = "WRITE_ORDER_ITEMS",
  ReadOrderItems = "READ_ORDER_ITEMS",
  WriteReportedReview = "WRITE_REPORTED_REVIEWS",
  ReadReportedReview = "READ_REPORTED_REVIEWS",
  WriteSupport = "WRITE_SUPPORTS",
  ReadSupport = "READ_SUPPORTS",
  WriteArticles = "WRITE_ARTICLES",
  ReadArticles = "READ_ARTICLES",
}
