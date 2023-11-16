import { useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { PetBusiness } from "@/types/types";

export const useGetAllPetBusinesses = () => {
  return useQuery({
    queryKey: ["pet-businesses"],
    queryFn: async () => {
      const { data } = await api.get(`/users/pet-businesses`);
      const petBusinesses: PetBusiness[] = data.map((data: any) => ({
        userId: data.user.userId,
        companyName: data.companyName,
        uen: data.uen,
        businessType: data.businessType,
        businessDescription: data.businessDescription,
        contactNumber: data.contactNumber,
        websiteURL: data.websiteURL,
        stripeAccountId: data.stripeAccountId,
        email: data.user.email,
        accountType: data.user.accountType,
        accountStatus: data.user.accountStatus,
        dateCreated: data.user.dateCreated,
        lastUpdated: data.user.lastUpdated,
        commissionRule: data.commissionRule,
      }));
      return petBusinesses;
    },
  });
};
