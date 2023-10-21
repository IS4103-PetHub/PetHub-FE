import { useQuery } from "@tanstack/react-query";
import { OrderItem } from "shared-utils";
import api from "@/api/axiosConfig";

const ORDER_ITEMS_API = "/order-items";

export const useGetAllOrderItem = (
  petBusinessFilter: number,
  startDate: string,
  endDate: string,
  statusFilter: string,
) => {
  const params = {
    statusFilter: statusFilter,
    startDate: startDate,
    endDate: endDate,
    petBusinessFilter: petBusinessFilter,
  };
  return useQuery({
    queryKey: ["order-items", { params }],
    queryFn: async () => {
      const response = await api.get(`${ORDER_ITEMS_API}`, { params });
      return response.data as OrderItem[];
    },
  });
};
