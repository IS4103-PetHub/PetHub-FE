import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { Booking } from "@/types/types";

const BOOKING_API = "/bookings";

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { petOwnerId, ...payloadWithoutId } = payload;
      return (
        await api.post(
          `${BOOKING_API}?petOwnerId=${petOwnerId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};

export const useUpdateBooking = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { bookingId, ...payloadWithoutId } = payload;
      return (await api.patch(`${BOOKING_API}/${bookingId}`, payloadWithoutId))
        .data;
    },
  });
};

export const useGetBookingsByUserId = (
  userId: number,
  startTime: string,
  endTime: string,
) => {
  const params = { startTime, endTime };
  return useQuery({
    queryKey: ["bookings", { petOwnerId: userId }, { params }],
    queryFn: async () => {
      const response = await api.get(`${BOOKING_API}/users/${userId}`, {
        params,
      });
      return response.data as Booking[];
    },
    // only run this query if all the values are not null
    enabled: !!(userId && startTime && endTime),
  });
};

export const useGetBookingsByPetBusiness = (
  petBusinessId: number,
  params: {
    startTime: string;
    endTime: string;
  },
) => {
  return useQuery({
    queryKey: ["bookings", { petBusinessId: petBusinessId }],
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
