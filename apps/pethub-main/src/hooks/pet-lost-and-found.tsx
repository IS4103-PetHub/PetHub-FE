import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { PetRequestTypeEnum } from "@/types/constants";
import { CreatePetLostAndFoundPayload } from "@/types/types";

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

export const useGetAllPetLostAndFound = (requestType?: PetRequestTypeEnum) => {
  return useQuery({
    queryKey: ["lost-and-found"],
    queryFn: async () => {
      const data = await (
        await api.get(`${PET_LOST_AND_FOUND_API}`, { params: requestType })
      ).data;
      return data;
    },
  });
};
