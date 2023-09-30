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

export const useUpdateCalendarGroup = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CalendarGroup) => {
      const { calendarGroupId, ...payloadWithoutId } = payload;
      return (
        await api.put(
          `${CALENDAR_GROUP_API}/${calendarGroupId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};

export const useGetCalendarGroupById = (calendarGroupId: number) => {
  return useQuery({
    queryKey: ["calendar-group", calendarGroupId],
    queryFn: async () => {
      const response = await api.get(
        `${CALENDAR_GROUP_API}/${calendarGroupId}?formatForFrontend=true`,
      );
      return response.data as CalendarGroup;
    },
    refetchOnMount: true,
  });
};

export const useDeleteCalendarGroupById = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (await api.delete(`${CALENDAR_GROUP_API}/${id}`)).data;
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
