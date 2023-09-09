import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CreatePetOwnerPayload, PetOwner } from "@/types/types";

const PET_OWNER_API = "api/users/pet-owners";

export const useCreatePetOwner = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CreatePetOwnerPayload) => {
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_OWNER_API}`,
          payload,
        )
      ).data;
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
        await axios.patch(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_OWNER_API}/${payload.userId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};

export const useGetPetOwnerById = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (userId: number) => {
      const data = await (
        await axios.get(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_OWNER_API}/${userId}`,
        )
      ).data;
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
      return petOwner;
    },
  });
};
