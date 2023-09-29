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

export const useUpdateCalendarGroup = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CalendarGroup) => {
      const calendarGroupId = payload.calendarGroupId;
      delete payload.calendarGroupId;
      return (
        await api.put(`${CALENDER_GROUP_API}/${calendarGroupId}`, payload)
      ).data;
    },
  });
};

export const useGetCalendarGroupById = (calendarGroupId: number) => {
  return useQuery({
    queryKey: ["calendar-group", calendarGroupId],
    queryFn: async () => {
      const response = await api.get(
        `${CALENDER_GROUP_API}/${calendarGroupId}`,
      );
      return response.data as CalendarGroup;
    },
  });
};
