import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Permission } from "@/types/types";

const RBAC_API = "api/rbac";

export const useGetAllPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () =>
      (
        await axios.get(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${RBAC_API}/permissions`,
        )
      ).data as Permission[],
  });
};
