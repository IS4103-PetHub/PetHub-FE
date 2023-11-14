import { useMutation, useQuery } from "@tanstack/react-query";
import { ServiceListing, AccountTypeEnum, PetOwner } from "shared-utils";
import api from "@/api/axiosConfig";
import {
  AddRemoveFavouriteServiceListingPayload,
  CreatePetOwnerPayload,
} from "@/types/types";

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
        points: data.points,
      };
      return petOwner as PetOwner;
    },
    enabled: accountType === AccountTypeEnum.PetOwner,
  });
};

// GET Favourite Service Listings by PO Id and QueryParams
export const useGetAllFavouriteServiceListingsByPetOwnerIdWithQueryParams = (
  userId: number,
  categoryValue?: string,
) => {
  const params = { category: categoryValue };
  return useQuery({
    queryKey: ["pet-owners", categoryValue],
    queryFn: async () => {
      if (categoryValue) {
        const response = await api.get(
          `${PET_OWNER_API}/favourites/${userId}`,
          {
            params,
          },
        );
        return response.data as ServiceListing[];
      } else {
        const response = await api.get(`${PET_OWNER_API}/favourites/${userId}`);
        return response.data as ServiceListing[];
      }
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
