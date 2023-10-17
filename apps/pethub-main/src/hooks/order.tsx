import { useMutation, useQuery } from "@tanstack/react-query";
import { OrderItem } from "shared-utils";
import api from "@/api/axiosConfig";

const ORDER_ITEMS_API = "/order-items";

export const useGetorderItemsByPetOwnerId = (petOwnerId: number) => {
  return useQuery({
    queryKey: ["order-items"],
    queryFn: async () => {
      const response = await api.get(
        `${ORDER_ITEMS_API}/pet-owners/${petOwnerId}`,
      );
      return response.data as OrderItem[];
    },
    // only run this query if all the values are not null
    enabled: !!petOwnerId,
  });
};

export const useCompleteOrderItem = (orderItemId: number) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      return (
        await api.post(
          `${ORDER_ITEMS_API}/complete-order/${orderItemId}`,
          payload,
        )
      ).data;
    },
    // onSuccess: (data) => {
    //   if (data.code === 200) {
    //     console.log("Order item completed successfully");
    //   } else if (data.code === 400) {
    //     console.log("Bad request. Invalid voucher code or order item ID.");
    //   } else if (data.code === 404) {
    //     console.log("Order item not found.");
    //   }
    // },
  });
};
