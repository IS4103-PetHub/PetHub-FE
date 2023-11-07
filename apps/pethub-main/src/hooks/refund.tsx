import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { RefundRequest } from "shared-utils";
import api from "@/api/axiosConfig";
import {
  ApproveOrRejectRefundRequestPayload,
  CreateRefundRequestPayload,
} from "@/types/types";
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
    mutationFn: async (payload: ApproveOrRejectRefundRequestPayload) => {
      const { refundRequestId, ...payloadWithoutId } = payload;
      return (
        await api.patch(
          `${REFUND_API}/reject/${refundRequestId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};

export const useApproveRefundRequest = () => {
  return useMutation({
    mutationFn: async (payload: ApproveOrRejectRefundRequestPayload) => {
      const { refundRequestId, ...payloadWithoutId } = payload;
      return (
        await api.patch(
          `${REFUND_API}/approve/${refundRequestId}`,
          payloadWithoutId,
        )
      ).data;
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

export const useGetRefundRequestsByPBId = (
  petBusinessId: number,
  startDate: string,
  endDate: string,
  statusFilter: string,
  serviceListingFilters: string,
) => {
  const params = {
    statusFilter: statusFilter,
    startDate: startDate,
    endDate: endDate,
    serviceListingFilters: serviceListingFilters,
  };
  return useQuery({
    queryKey: ["refund-requests", { petBusinessId: petBusinessId }, { params }],
    queryFn: async () => {
      const response = await api.get(
        `${REFUND_API}/pet-businesses/${petBusinessId}`,
        { params },
      );
      return response.data as RefundRequest[];
    },
  });
};
