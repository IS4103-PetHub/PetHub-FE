import { useMutation, useQuery } from "@tanstack/react-query";
import { AccountTypeEnum } from "shared-utils";
import api from "@/api/axiosConfig";
import { CreatePetBusinessPayload, PetBusiness } from "@/types/types";

const PET_BUSINESS_API = "/users/pet-businesses";

export const useCreatePetBusiness = () => {
  return useMutation({
    mutationFn: async (payload: CreatePetBusinessPayload) => {
      return (await api.post(`${PET_BUSINESS_API}`, payload)).data;
    },
  });
};

export const useUpdatePetBusiness = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { userId, ...payloadWithoutId } = payload;
      return (
        await api.patch(`${PET_BUSINESS_API}/${userId}`, payloadWithoutId)
      ).data;
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
      const data = await (await api.get(`${PET_BUSINESS_API}/${userId}`)).data;
      const petBusiness: PetBusiness = {
        userId,
        companyName: data.companyName,
        uen: data.uen,
        businessType: data.businessType,
        businessDescription: data.businessDescription,
        websiteURL: data.websiteURL,
        stripeAccountId: data.stripeAccountId,
        contactNumber: data.contactNumber,
        email: data.user.email,
        accountType: data.user.accountType,
        accountStatus: data.user.accountStatus,
        dateCreated: data.user.dateCreated,
        businessAddresses: data.businessAddresses,
        businessEmail: data.businessEmail,
        petBusinessApplication: data.petBusinessApplication,
        commissionRule: data.commissionRule,
      };
      return petBusiness as PetBusiness;
    },
    enabled: accountType === AccountTypeEnum.PetBusiness,
  });
};
