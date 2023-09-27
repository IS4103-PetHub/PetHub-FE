import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { CalendarGroup } from "@/types/types";
const CALENDER_GROUP_API = "/calendar-groups";

export const useCreateCalendarGroup = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CalendarGroup) => {
      // Temporarily appending petBusinessId since BE does not have session identification merged into dev yet
      const petBusinessId = payload.petBusinessId;
      delete payload.petBusinessId;
      return (
        await api.post(
          `${CALENDER_GROUP_API}/?petBusinessId=${petBusinessId}`,
          payload,
        )
      ).data;
    },
  });
};
