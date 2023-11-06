import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { CreateRefundRequestPayload } from "@/types/types";
const REFUND_API = "/refund-requests";

export const useCreateRefundRequest = () => {
  return useMutation({
    mutationFn: async (payload: CreateRefundRequestPayload) => {
      return (await api.post(`${REFUND_API}/`, payload)).data;
    },
  });
};

export const useCancelRefundRequest = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (await api.delete(`${REFUND_API}/${id}`)).data;
    },
  });
};

export const useRejectRefundRequest = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (await api.patch(`${REFUND_API}/reject/${id}`)).data;
    },
  });
};

export const useApproveRefundRequest = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (await api.patch(`${REFUND_API}/approve/${id}`)).data;
    },
  });
};

export const useGetRefundRequestById = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (await api.get(`${REFUND_API}/${id}`)).data;
    },
  });
};
