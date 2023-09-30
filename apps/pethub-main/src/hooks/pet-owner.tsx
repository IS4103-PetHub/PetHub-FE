import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { AccountTypeEnum, ServiceListing } from "shared-utils";
import api from "@/api/axiosConfig";
import {
  AddRemoveFavouriteServiceListingPayload,
  CreatePetOwnerPayload,
  PetOwner,
} from "@/types/types";

const PET_OWNER_API = "/users/pet-owners";

export const useCreatePetOwner = () => {
  return useMutation({
    mutationFn: async (payload: CreatePetOwnerPayload) => {
      return (await api.post(`${PET_OWNER_API}`, payload)).data;
    },
  });
};

export const useUpdatePetOwner = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(([key]) => !["userId"].includes(key)),
      );
      return (
        await api.patch(`${PET_OWNER_API}/${payload.userId}`, payloadWithoutId)
      ).data;
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

// GET Favourite Service Listings by PO Id
export const useGetFavouriteServiceListingByPetOwnerId = (userId: number) => {
  return useQuery({
    queryFn: async () => {
      const response = await api.get(`${PET_OWNER_API}/favourites/${userId}`);
      return response.data as ServiceListing[];
    },
    refetchOnMount: true,
  });
};

// POST add to favourites
export const useAddServiceListingToFavourites = () => {
  return useMutation({
    mutationFn: async (payload: AddRemoveFavouriteServiceListingPayload) => {
      const { userId, ...payloadWithoutUserId } = payload;
      return (
        await api.post(
          `${PET_OWNER_API}/add-to-favourites/${userId}`,
          payloadWithoutUserId,
        )
      ).data;
    },
  });
};

// POST remove from favourites
export const useRemoveServiceListingFromFavourites = () => {
  return useMutation({
    mutationFn: async (payload: AddRemoveFavouriteServiceListingPayload) => {
      const { userId, ...payloadWithoutUserId } = payload;
      return (
        await api.post(
          `${PET_OWNER_API}/remove-from-favourites/${userId}`,
          payloadWithoutUserId,
        )
      ).data;
    },
  });
};
