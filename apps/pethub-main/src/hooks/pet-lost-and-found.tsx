import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import {
  CreatePetLostAndFoundPayload,
  PetLostAndFound,
  UpdatePetLostAndFoundPayload,
} from "@/types/types";

const PET_LOST_AND_FOUND_API = "/lost-and-found";

export const useCreatePetLostAndFoundPost = () => {
  return useMutation({
    mutationFn: async (payload: CreatePetLostAndFoundPayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("requestType", payload.requestType);
      formData.append("lastSeenDate", payload.lastSeenDate);
      formData.append("lastSeenLocation", payload.lastSeenLocation);
      formData.append("contactNumber", payload.contactNumber);
      if (payload.petId) {
        formData.append("petId", payload.petId);
      }
      if (payload.file) {
        formData.append("file", payload.file);
      }

      const response = await api.post(
        `${PET_LOST_AND_FOUND_API}/?petOwnerId=${payload.petOwnerId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
  });
};

// used to get all posts, by request type, or by a PO user id
export const useGetPetLostAndFoundPostsByRequestTypeAndUserId = (
  activeType?: string,
  userId?: number,
) => {
  return useQuery({
    queryKey: ["lost-and-found", { requestType: activeType, userId: userId }],
    queryFn: async () => {
      if (activeType === "MY_POSTS") {
        const data = await (
          await api.get(`${PET_LOST_AND_FOUND_API}/pet-owner/${userId}`)
        ).data;
        return data as PetLostAndFound[];
      }

      const params = { requestType: activeType };
      const data = await (
        await api.get(`${PET_LOST_AND_FOUND_API}`, {
          params,
        })
      ).data;
      return data as PetLostAndFound[];
    },
  });
};

export const useDeletePetLostAndFoundPostById = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (await api.delete(`${PET_LOST_AND_FOUND_API}/${id}`)).data;
    },
  });
};

export const useUpdatePetLostAndFoundPost = () => {
  return useMutation({
    mutationFn: async (payload: UpdatePetLostAndFoundPayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("requestType", payload.requestType);
      formData.append("lastSeenDate", payload.lastSeenDate);
      formData.append("lastSeenLocation", payload.lastSeenLocation);
      formData.append("contactNumber", payload.contactNumber);
      formData.append("isResolved", payload.isResolved.toString());
      if (payload.petId) {
        formData.append("petId", payload.petId);
      }
      if (payload.file) {
        formData.append("file", payload.file);
      }

      const response = await api.put(
        `${PET_LOST_AND_FOUND_API}/${payload.petLostAndFoundId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
  });
};
