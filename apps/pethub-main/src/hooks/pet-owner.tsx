import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CreatePetOwnerRequest } from "@/types/types";

export const usePetOwnerCreate = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CreatePetOwnerRequest) => {
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/users/pet-owners`,
          payload,
        )
      ).data;
    },
  });
};
