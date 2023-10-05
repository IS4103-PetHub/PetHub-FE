import { useQuery } from "@tanstack/react-query";
import { Tag } from "shared-utils";
import api from "@/api/axiosConfig";

const TAG_API = "tags";

export const useGetAllTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const data = await api.get(`${TAG_API}`);
      return data.data as Tag[];
    },
  });
};
