import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import {
  commentSupportPayload,
  createSupportTicketPayload,
} from "@/types/types";

const SUPPORT_API = "/support-tickets";

export const usePetBusinessCreateSupportTickets = () => {
  return useMutation({
    mutationFn: async (payload: createSupportTicketPayload) => {
      const formData = new FormData();
      formData.append("reason", payload.reason);
      formData.append("supportCategory", payload.supportCategory);
      formData.append("priority", payload.priority);
      payload.files.forEach((file) => {
        formData.append("files", file);
      });

      return (
        await api.post(
          `${SUPPORT_API}/pet-business/${payload.userId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        )
      ).data;
    },
  });
};

export const usePetOwnerCreateSupportTickets = () => {
  return useMutation({
    mutationFn: async (payload: createSupportTicketPayload) => {
      const formData = new FormData();
      formData.append("reason", payload.reason);
      formData.append("supportCategory", payload.supportCategory);
      formData.append("priority", payload.priority);
      payload.files.forEach((file) => {
        formData.append("files", file);
      });

      return (
        await api.post(`${SUPPORT_API}/pet-owner/${payload.userId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    },
  });
};

export const useGetSupportTickets = (userId: number) => {
  return useQuery({
    queryKey: ["support-tickets", userId],
    queryFn: async () => {
      const response = await api.get(`${SUPPORT_API}/${userId}/user`);
      return response.data;
    },
  });
};

export const useGetSupportTicketsById = (supportTicketId: number) => {
  return useQuery({
    queryKey: ["support-tickets", supportTicketId],
    queryFn: async () => {
      const response = await api.get(`${SUPPORT_API}/${supportTicketId}`);
      return response.data;
    },
  });
};

export const useUpdateSupportTicketComment = (supportTicketId: number) => {
  return useMutation({
    mutationFn: async (payload: commentSupportPayload) => {
      const formData = new FormData();
      formData.append("comment", payload.comment);
      formData.append("userId", payload.userId.toString());
      payload.files.forEach((file) => {
        formData.append("files", file);
      });

      return (
        await api.post(`${SUPPORT_API}/${supportTicketId}/comments`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    },
  });
};

export const useCloseResolveSupportTicket = (supportTicketId: number) => {
  return useMutation({
    mutationFn: async () => {
      return (await api.put(`${SUPPORT_API}/close-resolved/${supportTicketId}`))
        .data;
    },
  });
};

export const useReopenSupportTicket = (supportTicketId: number) => {
  return useMutation({
    mutationFn: async () => {
      return (
        await api.put(`${SUPPORT_API}/reopen-unresolved/${supportTicketId}`)
      ).data;
    },
  });
};
