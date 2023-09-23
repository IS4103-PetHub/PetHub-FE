import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { CreateTagPayload, Tag, UpdateTagPayload } from "@/types/types";

const TAG_API = "/tags";

export const useGetAllTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => (await api.get(`${TAG_API}`)).data as Tag[],
  });
};
export const useDeleteTag = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (await api.delete(`${TAG_API}/${id}`)).data;
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
      return (await api.post(`${TAG_API}`, payload)).data;
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

export const useUpdateTag = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      return (await api.patch(`${TAG_API}/${payload.tagId}`, payload)).data;
    },
  });
};
