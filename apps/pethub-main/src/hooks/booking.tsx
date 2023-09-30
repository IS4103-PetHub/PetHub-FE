import { useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";

const BOOKING_API = "/bookings";

export const useGetBookingsByPetBusiness = (
  petBusinessId: number,
  params: {
    startTime: string;
    endTime: string;
  },
) => {
  return useQuery({
    queryKey: ["bookings", petBusinessId],
    queryFn: async () => {
      const data = await (
        await api.get(`${BOOKING_API}/pet-business/${petBusinessId}`, {
          params: params,
        })
      ).data;
      return data;
    },
  });
};
