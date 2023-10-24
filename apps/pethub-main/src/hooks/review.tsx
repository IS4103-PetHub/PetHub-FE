import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { Review } from "shared-utils";
import api from "@/api/axiosConfig";
import { CreateReviewPayload, UpdateReviewPayload } from "@/types/types";
const REVIEW_API = "/reviews";

export const useCreateReview = () => {
  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("comment", payload.comment);
      formData.append("rating", payload.rating.toString());

      // Add files to the form data
      payload.files.forEach((file) => {
        formData.append("file", file);
      });

      const response = await api.post(
        `${REVIEW_API}/?orderItemId=${payload.orderItemId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data as Review;
    },
  });
};

export const useUpdateReview = () => {
  return useMutation({
    mutationFn: async (payload: UpdateReviewPayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("comment", payload.comment);
      formData.append("rating", payload.rating.toString());

      // Add files to the form data
      payload.files.forEach((file) => {
        formData.append("file", file);
      });

      const response = await api.patch(
        `${REVIEW_API}/${payload.reviewId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data as Review;
    },
  });
};
