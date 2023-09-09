import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AccountTypeEnum } from "@/types/constants";
import { CreatePetBusinessPayload, PetBusiness } from "@/types/types";

const PET_BUSINESS_API = "api/users/pet-businesses";

export const useCreatePetBusiness = () => {
  return useMutation({
    mutationFn: async (payload: CreatePetBusinessPayload) => {
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_BUSINESS_API}`,
          payload,
        )
      ).data;
    },
  });
};

export const useUpdatePetBusiness = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(([key]) => !["userId"].includes(key)),
      );
      return (
        await axios.patch(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_BUSINESS_API}/${payload.userId}`,
          payloadWithoutId,
        )
      ).data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["pet-businesses", data.user.accountType, data.userId],
      });
    },
  });
};

export const useGetPetBusinessByIdAndAccountType = (
  userId: number,
  accountType: AccountTypeEnum,
) => {
  return useQuery({
    queryKey: ["pet-businesses", accountType, userId],
    queryFn: async () => {
      const data = await (
        await axios.get(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/pet-businesses/${userId}`,
        )
      ).data;
      const petBusiness: PetBusiness = {
        userId,
        companyName: data.companyName,
        uen: data.uen,
        businessType: data.businessType,
        businessDescription: data.businessDescription,
        websiteURL: data.websiteURL,
        contactNumber: data.contactNumber,
        email: data.user.email,
        accountType: data.useraccountType,
        accountStatus: data.user.accountStatus,
        dateCreated: data.user.dateCreated,
      };
      return petBusiness;
    },
    enabled: accountType === AccountTypeEnum.PetBusiness,
  });
};
