import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { CalendarGroup } from "@/types/types";
const CALENDAR_GROUP_API = "/calendar-groups";

export const useCreateCalendarGroup = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CalendarGroup) => {
      const { petBusinessId, ...payloadWithoutId } = payload;
      return (
        await api.post(
          `${CALENDAR_GROUP_API}/?petBusinessId=${petBusinessId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};

export const useGetCalendarGroupByPBId = (petBusinessId: number) => {
  return useQuery({
    queryKey: ["calendar-group", petBusinessId],
    queryFn: async () => {
      const data = await (
        await api.get(`${CALENDAR_GROUP_API}/pet-business/${petBusinessId}`)
      ).data;
      return data;
    },
  });
};
