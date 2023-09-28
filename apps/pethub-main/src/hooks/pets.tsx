import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { Pet, PetPayload } from "@/types/types";

const PETS_API = "/pets";

export const useGetPetsByPetOwnerId = (userId: number) => {
  return useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const data = await api.get(`${PETS_API}/pet-owners/${userId}`);
      return data.data;
    },
  });
};

export const useCreatePet = () => {
  return useMutation({
    mutationFn: async (payload: PetPayload) => {
      console.log("LOGGIN PAYLOAD", payload);
      return (await api.post(`${PETS_API}`, payload)).data;
    },
    onError: (error) => {
      console.error("Error creating pet:", error);
      throw error;
    },
  });
};

export const useUpdatePet = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: PetPayload) => {
      console.log(payload);
      const { petId, ...payloadWithoutId } = payload;
      return (await api.patch(`${PETS_API}/${petId}`, payloadWithoutId)).data;
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
