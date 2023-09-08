import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CreatePetOwnerPayload } from "@/types/types";

export const usePetOwnerCreate = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CreatePetOwnerPayload) => {
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/pet-owners`,
          payload,
        )
      ).data;
    },
  });
};

export const usePetOwnerUpdate = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(([key]) => !["userId"].includes(key)),
      );
      return (
        await axios.patch(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/pet-owners/${payload.userId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};
