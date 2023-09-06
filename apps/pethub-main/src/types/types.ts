export interface CreatePetOwnerRequest {
  firstName: string;
  lastName: string;
  contactNumber: string;
  dateOfBirth: string;
  email: string;
  password: string;
}

export interface CreatePetBusinessRequest {
  companyName: string;
  uen: string;
  contactNumber: string;
  email: string;
  password: string;
}
