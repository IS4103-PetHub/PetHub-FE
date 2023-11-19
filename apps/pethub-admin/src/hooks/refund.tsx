import { useMutation } from "@tanstack/react-query";
import api from "@/api/axiosConfig";

const REFUND_API = "/refund-requests";

export const useReopenRefundRequest = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (await api.patch(`${REFUND_API}/reopen/${id}`)).data;
    },
  });
};
