import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { commentSupportPayload } from "../../../pethub-main/src/types/types";

const SUPPORT_API = "/support-tickets";

export const useGetSupportTickets = () => {
  return useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const response = await api.get(`${SUPPORT_API}`);
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

export const useCloseResolveSupportTicket = (supportTicketId: number) => {
  return useMutation({
    mutationFn: async () => {
      return (await api.put(`${SUPPORT_API}/close-resolved/${supportTicketId}`))
        .data;
    },
  });
};

export const useCloseUnresolveSupportTicket = (supportTicketId: number) => {
  return useMutation({
    mutationFn: async () => {
      return (
        await api.put(`${SUPPORT_API}/close-unresolved/${supportTicketId}`)
      ).data;
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
