import { useMutation, useQuery } from "@tanstack/react-query";
import { Article, ArticleComment } from "shared-utils";
import api from "@/api/axiosConfig";
import { CreateUpdateArticleCommentPayload } from "@/types/types";

const ARTICLE_API = "/articles";

export const useGetArticleById = (articleId: number) => {
  return useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const response = await api.get(`${ARTICLE_API}/${articleId}`);
      return response.data as Article;
    },
  });
};

export const useGetAllArticles = () => {
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await api.get(`${ARTICLE_API}`);
      return response.data as Article[];
    },
  });
};

export const useGetAllPinnedArticles = () => {
  return useQuery({
    queryKey: ["pinned-articles"],
    queryFn: async () => {
      const response = await api.get(`${ARTICLE_API}/pinned`);
      return response.data as Article[];
    },
  });
};

export const useCreateArticleComment = () => {
  return useMutation({
    mutationFn: async (payload: CreateUpdateArticleCommentPayload) => {
      const { articleId, ...payloadWithoutId } = payload;
      return (
        await api.post(`${ARTICLE_API}/${articleId}/comments`, payloadWithoutId)
      ).data;
    },
  });
};

export const useUpdateArticleComment = () => {
  return useMutation({
    mutationFn: async (payload: CreateUpdateArticleCommentPayload) => {
      const { articleCommentId, ...payloadWithoutId } = payload;
      return (
        await api.put(
          `${ARTICLE_API}/comments/${articleCommentId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};

export const useDeleteArticleComment = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (await api.delete(`${ARTICLE_API}/comments/${id}`)).data;
    },
  });
};

export const useGetArticleCommentsIdByArticleIdAndPetOwnerId = (
  articleId,
  petOwnerId: number,
) => {
  return useQuery({
    queryKey: ["article-comments", { petOwnerId, articleId }],
    queryFn: async () => {
      const response = await api.get(
        `${ARTICLE_API}/${articleId}/comments?petOwnerId=${petOwnerId}`,
      );
      return response.data as number[];
    },
    enabled: !!(articleId && petOwnerId),
  });
};

export const useSubscribeToNewsletter = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return (await api.post(`${ARTICLE_API}/subscribe`, { email })).data;
    },
  });
};
