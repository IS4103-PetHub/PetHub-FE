import { useMutation } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { CheckoutCartPayload } from "@/types/types";

export const useStripeCheckoutCart = () => {
  return useMutation({
    mutationFn: async (payload: CheckoutCartPayload) => {
      return (await api.post("/payments/checkout", payload)).data;
    },
    onError: (error) => {
      console.error("Error: ", error);
      throw error;
    },
  });
};
