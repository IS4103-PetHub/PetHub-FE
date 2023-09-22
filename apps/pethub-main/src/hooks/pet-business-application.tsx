import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import {
  PetBusinessApplication,
  CreatePetBusinessApplicationPayload,
} from "@/types/types";
const PET_BUSINESS_APPLICATION_API = "/pb-applications";

export const useCreatePetBusinessApplication = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CreatePetBusinessApplicationPayload) => {
      return (await api.post(`${PET_BUSINESS_APPLICATION_API}`, payload)).data;
    },
  });
};

export const useUpdatePetBusinessApplication = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(
          ([key]) => !["petBusinessApplicationId"].includes(key),
        ),
      );
      return (
        await api.put(
          `${PET_BUSINESS_APPLICATION_API}/${payload.petBusinessApplicationId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};

export const useGetPetBusinessApplicationByPBId = (
  petBusinessApplicationId: number,
) => {
  return useQuery({
    queryKey: ["pet-business-application", petBusinessApplicationId],
    queryFn: async () => {
      const data = await (
        await api.get(
          `${PET_BUSINESS_APPLICATION_API}/pet-business/${petBusinessApplicationId}`,
        )
      ).data;
      const petBusinessApplication: PetBusinessApplication = {
        petBusinessApplicationId: data.petBusinessApplicationId,
        businessType: data.businessType,
        businessEmail: data.businessEmail,
        websiteURL: data.websiteURL,
        businessDescription: data.businessDescription,
        businessAddresses: data.businessAddresses,
        attachments: data.attachments,
        applicationStatus: data.applicationStatus,
        adminRemarks: data.adminRemarks,
        dateCreated: data.dateCreated,
        lastUpdated: data.lastUpdated,
        petBusinessId: data.petBusinessId,
        approverId: data.approverId,
        approver: data.approver,
      };
      return petBusinessApplication as PetBusinessApplication;
    },
  });
};
