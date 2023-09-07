import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CreatePetBusinessRequest } from "@/types/types";

export const usePetBusinessCreate = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CreatePetBusinessRequest) => {
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/pet-businesses`,
          payload,
        )
      ).data;
    },
  });
};
