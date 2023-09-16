import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PetBusiness } from "@/types/types";

export const useGetAllPetBusinesses = () => {
  return useQuery({
    queryKey: ["pet-businesses"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/pet-businesses`,
      );
      const petBusinesses: PetBusiness[] = data.map((data: any) => ({
        userId: data.user.userId,
        companyName: data.companyName,
        uen: data.uen,
        businessType: data.businessType,
        businessDescription: data.businessDescription,
        websiteURL: data.websiteURL,
        email: data.user.email,
        accountType: data.user.accountType,
        accountStatus: data.user.accountStatus,
        dateCreated: data.user.dateCreated,
        lastUpdated: data.user.lastUpdated,
      }));
      return petBusinesses;
    },
  });
};
