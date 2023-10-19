import { useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { PetRequestTypeEnum } from "@/types/constants";

const PET_LOST_AND_FOUND_API = "/lost-and-found";

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
