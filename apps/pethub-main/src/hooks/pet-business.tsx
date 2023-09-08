import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CreatePetBusinessPayload } from "@/types/types";

export const usePetBusinessCreate = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CreatePetBusinessPayload) => {
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/pet-businesses`,
          payload,
        )
      ).data;
    },
  });
};

export const usePetBusinessUpdate = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(([key]) => !["userId"].includes(key)),
      );
      return (
        await axios.patch(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/pet-businesses/${payload.userId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};
