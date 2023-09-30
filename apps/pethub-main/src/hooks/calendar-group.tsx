import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { CalendarGroup } from "@/types/types";
const CALENDER_GROUP_API = "/calendar-groups";

export const useCreateCalendarGroup = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CalendarGroup) => {
      const { petBusinessId, ...payloadWithoutId } = payload;
      return (
        await api.post(
          `${CALENDER_GROUP_API}/?petBusinessId=${petBusinessId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};
