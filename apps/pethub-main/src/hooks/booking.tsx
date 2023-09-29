import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BOOKING_API = "api/bookings";

export const useGetBookingsByPetBusiness = (
  petBusinessId: number,
  startTime: string,
  endTime: string,
) => {
  return useQuery({
    queryKey: ["bookings", petBusinessId],
    queryFn: async () => {
      const data = await (
        await axios.get(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${BOOKING_API}/pet-business/${petBusinessId}`,
          {
            params: {
              startTime: startTime,
              endTime: endTime,
            },
          },
        )
      ).data;
      return data;
    },
  });
};
