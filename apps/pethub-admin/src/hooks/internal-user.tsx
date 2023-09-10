import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { InternalUser } from "@/types/types";

export const useGetAllInternalUsers = () => {
  return useQuery({
    queryKey: ["internalUsers"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/internal-users`,
      );
      const internalUsers: InternalUser[] = data.map((data: any) => ({
        userId: data.user.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        adminRole: data.adminRole,
        email: data.user.email,
        accountType: data.user.accountType,
        accountStatus: data.user.accountStatus,
        dateCreated: data.user.dateCreated,
      }));
      return internalUsers;
    },
  });
};
