import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const CALENDAR_GROUP_API = "api/calendar-groups";

export const useGetCalendarGroupByPBId = (
  petBusinessId: number,
  includeTimeSlot: boolean,
  includeBooking: boolean,
) => {
  return useQuery({
    queryKey: ["calendar-group", petBusinessId],
    queryFn: async () => {
      const data = await (
        await axios.get(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${CALENDAR_GROUP_API}/pet-business/${petBusinessId}`,
          {
            params: {
              includeTimeSlot: includeTimeSlot,
              includeBooking: includeBooking,
            },
          },
        )
      ).data;
      return data;
    },
  });
};
