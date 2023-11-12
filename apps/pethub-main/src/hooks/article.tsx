import { useMutation, useQuery } from "@tanstack/react-query";
import { Article } from "shared-utils";
import api from "@/api/axiosConfig";

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
