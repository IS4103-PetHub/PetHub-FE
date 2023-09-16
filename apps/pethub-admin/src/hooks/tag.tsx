import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CreateTagPayload, Tag, UpdateTagPayload } from "@/types/types";

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

export const useCreateTag = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CreateTagPayload) => {
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${TAG_API}`,
          payload,
        )
      ).data;
    },
    onSuccess: (data) => {
      const newTag: Tag = {
        tagId: data.tagId,
        name: data.name,
        dateCreated: data.dateCreated,
        lastUpdated: data.lastUpdated,
      };
      queryClient.setQueryData<Tag[]>(["tags"], (old = []) => {
        return [...old, newTag];
        // appends newly created record to cache
      });
    },
  });
};

export const useUpdateTag = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: UpdateTagPayload) => {
      return (
        await axios.patch(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${TAG_API}/${payload.tagId}`,
          payload,
        )
      ).data;
    },
  });
};
