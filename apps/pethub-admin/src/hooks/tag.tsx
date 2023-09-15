import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Tag } from "@/types/types";

const TAG_API = "api/tags";

export const useGetAllTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () =>
      (await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/${TAG_API}`))
        .data as Tag[],
  });
};
export const useDeleteTag = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (
        await axios.delete(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${TAG_API}/${id}`,
        )
      ).data;
    },
    onSuccess: (data, id) => {
      queryClient.setQueryData<Tag[]>(["tags"], (old = []) => {
        return old.filter((tag) => tag.tagId !== id);
        // removes deleted record from cache
      });
    },
  });
};
