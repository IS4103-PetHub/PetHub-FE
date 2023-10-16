import { useQuery } from "@tanstack/react-query";
import { OrderItem } from "shared-utils";
import api from "@/api/axiosConfig";

const ORDER_ITEM_API = "/order-items";

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
        `${ORDER_ITEM_API}/pet-businesses/${petBusinessId}`,
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
      const response = await api.get(`${ORDER_ITEM_API}/${orderItemId}`);
      return response.data as OrderItem;
    },
  });
};
