import { useMutation, useQuery } from "@tanstack/react-query";
import { OrderItem } from "shared-utils";
import api from "@/api/axiosConfig";

const ORDER_ITEMS_API = "/order-items";

export const useGetorderItemsByPetOwnerId = (petOwnerId: number) => {
  return useQuery({
    queryKey: ["orderItems", { petOwnerId: petOwnerId }],
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