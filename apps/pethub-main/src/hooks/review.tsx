import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { Review, ReviewStatsResponse } from "shared-utils";
import api from "@/api/axiosConfig";
import {
  CreateReviewPayload,
  ReplyReviewPayload,
  ReportReviewPayload,
  UpdateReviewPayload,
} from "@/types/types";
const REVIEW_API = "/reviews";
const CHART_API = "/chart";

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

export const useDeleteReview = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (await api.delete(`${REVIEW_API}/${id}`)).data;
    },
  });
};

export const useReportReview = () => {
  return useMutation({
    mutationFn: async (payload: ReportReviewPayload) => {
      const { reviewId, reportReason } = payload;
      return (
        await api.post(
          `${REVIEW_API}/report-review/${reviewId}?reportReason=${reportReason}`,
        )
      ).data;
    },
  });
};

export const useReplyReview = () => {
  return useMutation({
    mutationFn: async (payload: ReplyReviewPayload) => {
      const { reviewId, reply } = payload;
      return (
        await api.patch(`${REVIEW_API}/reply-review/${reviewId}`, { reply })
      ).data;
    },
  });
};

export const useToggleLikedReview = () => {
  return useMutation({
    mutationFn: async (reviewId: number) => {
      return (await api.post(`${REVIEW_API}/toggle-liked-review/${reviewId}`))
        .data;
    },
  });
};

// GET the liked and reported review IDs for a PetOwner filtered by a ServiceListing
export const useGetLikedAndReportedReviews = (serviceListingId: number) => {
  return useQuery({
    queryKey: ["liked-reported", serviceListingId],
    queryFn: async () => {
      const response = await api.get(
        `${REVIEW_API}/liked-reported/${serviceListingId}`,
      );
      return response.data as { likesBy: number[]; reportsBy: number[] };
    },
  });
};

// GET data for the review stats section of the SL details page
export const useGetReviewStatsForServiceListing = (
  serviceListingId: number,
  monthsBack = 6,
) => {
  return useQuery({
    queryKey: ["review-stats", serviceListingId],
    queryFn: async () => {
      const response = await api.get(
        `${CHART_API}/reviews/data/${serviceListingId}?monthsBack=${monthsBack}`,
      );
      return response.data as ReviewStatsResponse;
    },
    enabled: !!serviceListingId, // Only run when has ID
  });
};
