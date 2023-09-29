import { useMutation } from "@tanstack/react-query";
import api from "@/api/axiosConfig";

const BOOKING_API = "/bookings";

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(
          ([key]) => !["petOwnerId"].includes(key),
        ),
      );
      return (
        await api.post(
          `${BOOKING_API}?petOwnerId=${payload.petOwnerId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};
