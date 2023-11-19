import { useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";

const PAYOUT_INVOICE_API = "/payout-invoice";

export const useGetPetBusinessPayoutInvoice = (userId: number) => {
  return useQuery({
    queryKey: ["payout-invoice", userId],
    queryFn: async () => {
      const response = await api.get(
        `${PAYOUT_INVOICE_API}/pet-businesses/${userId}`,
      );
      return response.data;
    },
  });
};

export const useGetPayoutInvoiceById = (invoiceId: number) => {
  return useQuery({
    queryKey: ["payout-invoice", invoiceId],
    queryFn: async () => {
      const response = await api.get(`${PAYOUT_INVOICE_API}/${invoiceId}`);
      return response.data;
    },
  });
};
