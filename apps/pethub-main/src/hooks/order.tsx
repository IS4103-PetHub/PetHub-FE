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
  });
};

export const useGetOrderItemsByPBId = (
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
    queryKey: ["order-items", { petBusinessId: petBusinessId }, { params }],
    queryFn: async () => {
      const response = await api.get(
        `${ORDER_ITEMS_API}/pet-businesses/${petBusinessId}`,
        { params },
      );
      return response.data as OrderItem[];
    },
  });
};

export const useGetOrderItemByOrderId = (orderItemId: number) => {
  return useQuery({
    queryKey: ["order-items", orderItemId],
    queryFn: async () => {
      const response = await api.get(`${ORDER_ITEMS_API}/${orderItemId}`);
      return response.data as OrderItem;
    },
  });
};
