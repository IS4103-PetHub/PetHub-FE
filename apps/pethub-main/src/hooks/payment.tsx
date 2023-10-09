import { useMutation } from "@tanstack/react-query";
import api from "@/api/axiosConfig";

export const useStripePaymentMethod = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      return (await api.post("/pay", payload)).data;
    },
    onError: (error) => {
      console.error("Error with Stripe Payment Method:", error);
      throw error;
    },
  });
};
