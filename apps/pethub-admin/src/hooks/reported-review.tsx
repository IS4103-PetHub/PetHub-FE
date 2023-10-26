import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Review } from "shared-utils";
import api from "@/api/axiosConfig";

const REPORTED_REVIEW_API = "/reviews";

export const useGetAllReportedReviews = () => {
  return useQuery({
    queryKey: ["reported-reviews"],
    queryFn: async () => {
      const response = await api.get(`${REPORTED_REVIEW_API}/reported-reviews`);
      return response.data;
    },
  });
};

export const useDeleteReview = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (reviewId: number) => {
      return (await api.delete(`${REPORTED_REVIEW_API}/${reviewId}`)).data;
    },
    onSuccess: (data, reviewId) => {
      queryClient.setQueryData<Review[]>(
        ["reported-reviews"],
        (oldReviews = []) => {
          return oldReviews.filter((review) => review.reviewId !== reviewId);
        },
      );
    },
  });
};

export const useResolveReview = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (reviewId: number) => {
      return (
        await api.post(`${REPORTED_REVIEW_API}/resolve-review/${reviewId}`)
      ).data;
    },
    onSuccess: (data, reviewId) => {
      queryClient.setQueryData<Review[]>(
        ["reported-reviews"],
        (oldReviews = []) => {
          return oldReviews.filter((review) => review.reviewId !== reviewId);
        },
      );
    },
  });
};
