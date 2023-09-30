import { useQuery } from "@tanstack/react-query";
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
