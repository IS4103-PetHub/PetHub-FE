import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  PetBusinessApplication,
  CreatePetBusinessApplicationPayload,
} from "@/types/types";
const PET_BUSINESS_APPLICATION_API = "api/pb-applications";

export const useCreatePetBusinessApplication = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CreatePetBusinessApplicationPayload) => {
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_BUSINESS_APPLICATION_API}`,
          payload,
        )
      ).data;
    },
  });
};

export const useUpdatePetBusinessApplication = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      console.log("payload", payload);
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(
          ([key]) => !["petBusinessApplicationId"].includes(key),
        ),
      );
      return (
        await axios.put(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${PET_BUSINESS_APPLICATION_API}/${payload.petBusinessApplicationId}`,
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
