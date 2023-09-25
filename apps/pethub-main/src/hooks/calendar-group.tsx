import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import {
  PetBusinessApplication,
  CreatePetBusinessApplicationPayload,
} from "@/types/types";
const CALENDER_GROUP_API = "/calender-group";

export const useCreateCalendarGroup = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      return (await api.post(`${CALENDER_GROUP_API}`, payload)).data;
    },
  });
};
