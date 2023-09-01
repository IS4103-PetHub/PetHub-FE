import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
//import { CreatePetOwnerRequest } from "@/types/types";

//awaiting backend. this is inaccurate.

export const usePetOwnerRetrieveAll = () => {
  return useQuery({
    queryKey: ["petOwners"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/users/pet-owners`,
      );
      return data;
    },
  });
};
