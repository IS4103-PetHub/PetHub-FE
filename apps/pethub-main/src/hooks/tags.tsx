import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Tag } from "@/types/types";

const TAG_API = "api/tags";

export const useGetAllTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/${TAG_API}`,
      );
      return data.data as Tag[];
    },
  });
};