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
