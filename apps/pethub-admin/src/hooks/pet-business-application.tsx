import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import {
  ApprovePetBusinessApplicationPayload,
  PetBusinessApplication,
  RejectPetBusinessApplicationPayload,
} from "@/types/types";
const PET_BUSINESS_APPLICATION_API = "/pb-applications";

export const useGetPetBusinessApplicationById = (
  petBusinessApplicationId: number,
) => {
  return useQuery({
    queryKey: ["pet-business-application", petBusinessApplicationId],
    queryFn: async () => {
      const response = await api.get(
        `${PET_BUSINESS_APPLICATION_API}/${petBusinessApplicationId}`,
      );
      return response.data as PetBusinessApplication;
    },
  });
};

export const useGetAllPetBusinessApplications = () => {
  return useQuery({
    queryKey: ["pet-business-applications"],
    queryFn: async () =>
      (await api.get(`${PET_BUSINESS_APPLICATION_API}`))
        .data as PetBusinessApplication[],
  });
};

export const useApprovePetBusinessApplication = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: ApprovePetBusinessApplicationPayload) => {
      const { petBusinessApplicationId, ...restOfPayload } = payload;
      return (
        await api.post(
          `${PET_BUSINESS_APPLICATION_API}/approve/${petBusinessApplicationId}`,
          restOfPayload,
        )
      ).data;
    },
  });
};

export const useRejectPetBusinessApplication = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: RejectPetBusinessApplicationPayload) => {
      const { petBusinessApplicationId, ...restOfPayload } = payload;
      return (
        await api.post(
          `${PET_BUSINESS_APPLICATION_API}/reject/${petBusinessApplicationId}`,
          restOfPayload,
        )
      ).data;
    },
  });
};
