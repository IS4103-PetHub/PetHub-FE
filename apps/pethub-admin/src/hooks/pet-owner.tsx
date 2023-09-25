import { useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { PetOwner } from "@/types/types";

export const useGetAllPetOwners = () => {
  return useQuery({
    queryKey: ["pet-owners"],
    queryFn: async () => {
      const { data } = await api.get(`/users/pet-owners`);
      const petOwners: PetOwner[] = data.map((data: any) => ({
        userId: data.user.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        contactNumber: data.contactNumber,
        email: data.user.email,
        accountType: data.user.accountType,
        accountStatus: data.user.accountStatus,
        dateCreated: data.user.dateCreated,
        lastUpdated: data.user.lastUpdated,
      }));
      return petOwners;
    },
  });
};
