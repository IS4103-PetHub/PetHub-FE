import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PetOwner } from "@/types/types";

export const usePetOwnerRetrieveAll = () => {
  return useQuery({
    queryKey: ["petOwners"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/pet-owners`,
      );
      return data;
    },
  });
};
