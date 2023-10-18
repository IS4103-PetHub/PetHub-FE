import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Pet } from "shared-utils";
import api from "@/api/axiosConfig";
import { PetPayload } from "@/types/types";

const PETS_API = "/pets";

export const useGetPetsByPetOwnerId = (userId: number) => {
  return useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const data = await api.get(`${PETS_API}/pet-owners/${userId}`);
      return data.data as Pet[];
    },
  });
};

export const useGetPetByPetId = (petId: number) => {
  return useQuery({
    queryFn: async () => {
      const data = await api.get(`${PETS_API}/${petId}`);
      return data.data as Pet;
    },
  });
};

export const useCreatePet = () => {
  return useMutation({
    mutationFn: async (payload: PetPayload) => {
      const formData = new FormData();

      formData.append("petOwnerId", payload.petOwnerId.toString());
      formData.append("petName", payload.petName);
      formData.append("petType", payload.petType);
      formData.append("gender", payload.gender);
      formData.append("weight", payload.petWeight.toString());
      if (payload.dateOfBirth) {
        formData.append("dateOfBirth", payload.dateOfBirth);
      }
      formData.append("microchipNumber", payload.microchipNumber);
      payload.files.forEach((file) => {
        formData.append("file", file);
      });

      return (
        await api.post(`${PETS_API}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).data;
    },
    onError: (error) => {
      console.error("Error creating pet:", error);
      throw error;
    },
  });
};

export const useUpdatePet = () => {
  return useMutation({
    mutationFn: async (payload: PetPayload) => {
      const { petId, ...payloadWithoutId } = payload;
      const formData = new FormData();
      formData.append("petOwnerId", payload.petOwnerId.toString());
      formData.append("petName", payload.petName);
      formData.append("petType", payload.petType);
      formData.append("gender", payload.gender);
      formData.append("weight", payload.petWeight.toString());
      formData.append("dateOfBirth", payload.dateOfBirth);
      formData.append("microchipNumber", payload.microchipNumber);
      payload.files.forEach((file) => {
        formData.append("file", file);
      });

      return (
        await api.patch(`${PETS_API}/${petId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).data;
    },
  });
};

export const useDeletePetById = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (petId: number) => {
      return (await api.delete(`${PETS_API}/${petId}`)).data;
    },
    onSuccess: (data, petId) => {
      queryClient.setQueryData<Pet[]>(["pets"], (oldPets = []) => {
        return oldPets.filter((pet) => pet.petId !== petId);
      });
    },
  });
};
