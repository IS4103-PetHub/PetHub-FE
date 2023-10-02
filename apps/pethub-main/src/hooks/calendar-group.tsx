import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { CalendarGroup } from "shared-utils";
import api from "@/api/axiosConfig";
import { Timeslot } from "@/types/types";

const CALENDAR_GROUP_API = "/calendar-groups";

export const useGetAvailableTimeSlotsByCGId = (
  cgId: number,
  startTime: string,
  endTime: string,
  duration: number,
) => {
  const params = { startTime, endTime, duration };
  return useQuery({
    queryKey: ["available-timeslots", { calendarGroupId: cgId }, { params }],
    queryFn: async () => {
      const response = await api.get(
        `${CALENDAR_GROUP_API}/available-timeslots/${cgId}`,
        { params },
      );
      return response.data as Timeslot[];
    },
    // only run this query if all the values are not null
    enabled: !!(cgId && startTime && endTime && duration),
  });
};

export const useCreateCalendarGroup = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CalendarGroup) => {
      console.log("sent", payload);
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

export const useUpdateCalendarGroup = () => {
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
    queryKey: ["calendar-groups", calendarGroupId],
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
    // onSuccess: (data, id) => {
    //   queryClient.setQueryData<CalendarGroup[]>(
    //     ["calendar-groups"],
    //     (oldCGs = []) => {
    //       return oldCGs.filter((cg) => cg.calendarGroupId !== id);
    //     }
    //   );
    // },
  });
};

export const useGetCalendarGroupByPBId = (petBusinessId: number) => {
  return useQuery({
    queryKey: ["calendar-groups", { petBusinessId }],
    queryFn: async () => {
      const data = await (
        await api.get(`${CALENDAR_GROUP_API}/pet-business/${petBusinessId}`)
      ).data;
      return data;
    },
  });
};
