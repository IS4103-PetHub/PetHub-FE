import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ApprovePetBusinessApplicationPayload,
  PetBusinessApplication,
  RejectPetBusinessApplicationPayload,
} from "@/types/types";
const PET_BUSINESS_APPLICATION_API = "api/pb-applications";

export const useGetPetBusinessApplicationByPBId = (
  petBusinessApplicationId: number,
) => {
  return useQuery({
    queryKey: ["pet-business-application", petBusinessApplicationId],
    queryFn: async () => {
      const data = await (
        await axios.get(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_BUSINESS_APPLICATION_API}/pet-business/${petBusinessApplicationId}`,
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

export const useApprovePetBusinessApplication = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: ApprovePetBusinessApplicationPayload) => {
      const { petBusinessApplicationId, ...restOfPayload } = payload;
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_BUSINESS_APPLICATION_API}/approve/${petBusinessApplicationId}`,
          payload,
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
          payload,
        )
      ).data;
    },
  });
};
