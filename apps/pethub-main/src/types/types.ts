export interface CreatePetOwnerRequest {
  firstName: string;
  lastName: string;
  contactNumber: string;
  dateOfBirth: string;
  user: {
    create: {
      email: string;
      password: string;
    };
  };
}

export interface CreatePetBusinessRequest {
  companyName: string;
  contactNumber: string;
  user: {
    create: {
      email: string;
      password: string;
    };
  };
}
