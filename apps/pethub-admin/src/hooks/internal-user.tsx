import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CreateInternalUserPayload, InternalUser } from "@/types/types";

const INTERNAL_USER_API = "api/users/internal-users";

export const useGetAllInternalUsers = () => {
  return useQuery({
    queryKey: ["internal-users"],
    refetchOnMount: true,
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/${INTERNAL_USER_API}`,
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
        lastUpdated: data.user.lastUpdated,
      }));
      return internalUsers;
    },
  });
};

export const useCreateInternalUser = () => {
  return useMutation({
    mutationFn: async (payload: CreateInternalUserPayload) => {
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${INTERNAL_USER_API}`,
          payload,
        )
      ).data;
    },
  });
};
