import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ApprovePetBusinessApplicationPayload,
  PetBusinessApplication,
  RejectPetBusinessApplicationPayload,
} from "@/types/types";
const PET_BUSINESS_APPLICATION_API = "api/pb-applications";

export const useGetPetBusinessApplicationById = (
  petBusinessApplicationId: number,
) => {
  return useQuery({
    queryKey: ["pet-business-application", petBusinessApplicationId],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_BUSINESS_APPLICATION_API}/${petBusinessApplicationId}`,
      );
      return response.data as PetBusinessApplication;
    },
  });
};

export const useGetAllPetBusinessApplications = () => {
  return useQuery({
    queryKey: ["pet-business-applications"],
    queryFn: async () =>
      (
        await axios.get(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_BUSINESS_APPLICATION_API}`,
        )
      ).data as PetBusinessApplication[],
  });
};

export const useApprovePetBusinessApplication = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: ApprovePetBusinessApplicationPayload) => {
      const { petBusinessApplicationId, ...restOfPayload } = payload;
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_BUSINESS_APPLICATION_API}/approve/${petBusinessApplicationId}`,
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
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_BUSINESS_APPLICATION_API}/reject/${petBusinessApplicationId}`,
          restOfPayload,
        )
      ).data;
    },
  });
};
