import { useMutation, useQuery } from "@tanstack/react-query";
import { AccountTypeEnum } from "shared-utils";
import api from "@/api/axiosConfig";
import { CreatePetOwnerPayload, PetOwner } from "@/types/types";

const PET_OWNER_API = "/users/pet-owners";

export const useCreatePetOwner = () => {
  return useMutation({
    mutationFn: async (payload: CreatePetOwnerPayload) => {
      return (await api.post(`${PET_OWNER_API}`, payload)).data;
    },
  });
};

export const useUpdatePetOwner = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { userId, ...payloadWithoutId } = payload;
      return (await api.patch(`${PET_OWNER_API}/${userId}`, payloadWithoutId))
        .data;
    },
  });
};

export const useGetPetOwnerByIdAndAccountType = (
  userId: number,
  accountType: AccountTypeEnum,
) => {
  return useQuery({
    queryKey: ["pet-owners", accountType, userId],
    queryFn: async () => {
      const data = await (await api.get(`${PET_OWNER_API}/${userId}`)).data;
      const petOwner: PetOwner = {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        contactNumber: data.contactNumber,
        email: data.user.email,
        accountType: data.user.accountType,
        accountStatus: data.user.accountStatus,
        dateCreated: data.user.dateCreated,
      };
      return petOwner as PetOwner;
    },
    enabled: accountType === AccountTypeEnum.PetOwner,
  });
};
