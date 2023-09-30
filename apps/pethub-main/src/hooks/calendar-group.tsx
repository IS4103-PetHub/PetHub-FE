import { useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";

const CALENDAR_GROUP_API = "/calendar-groups";

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
