import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { Article, Review, ReviewStatsResponse } from "shared-utils";
import api from "@/api/axiosConfig";
import { CreateOrUpdateArticlePayload } from "@/types/types";

const ARTICLE_API = "/articles";

export const useCreateArticle = () => {
  return useMutation({
    mutationFn: async (payload: CreateOrUpdateArticlePayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("content", payload.content);
      formData.append("internalUserId", payload.internalUserId.toString());
      formData.append("articleType", payload.articleType);
      formData.append("isPinned", payload.isPinned.toString());

      if (payload.file) {
        formData.append("file", payload.file);
      }

      payload.tags.forEach((tagId) => {
        formData.append("tagIds[]", tagId.toString());
      });

      payload.categories.forEach((category) => {
        formData.append("category[]", category.toString());
      });

      const response = await api.post(`${ARTICLE_API}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data as Article;
    },
  });
};

export const useUpdateArticle = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CreateOrUpdateArticlePayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("content", payload.content);
      formData.append("internalUserId", payload.internalUserId.toString());
      formData.append("articleType", payload.articleType);
      formData.append("isPinned", payload.isPinned.toString());

      if (payload.file) {
        formData.append("file", payload.file);
      }

      payload.tags.forEach((tagId) => {
        formData.append("tagIds[]", tagId.toString());
      });

      payload.categories.forEach((category) => {
        formData.append("category[]", category.toString());
      });

      const response = await api.put(
        `${ARTICLE_API}/${payload.articleId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data as Article;
    },
  });
};

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
