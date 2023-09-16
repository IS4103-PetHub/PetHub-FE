import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CreateInternalUserPayload, InternalUser } from "@/types/types";

const INTERNAL_USER_API = "api/users/internal-users";

export const useGetAllInternalUsers = () => {
  return useQuery({
    queryKey: ["internal-users"],
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

export const useGetInternalUserById = (userId: number) => {
  return useQuery({
    queryKey: ["internal-users", userId],
    queryFn: async () => {
      const data = await (
        await axios.get(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${INTERNAL_USER_API}/${userId}`,
        )
      ).data;
      const internalUser: InternalUser = {
        userId: data.user.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        adminRole: data.adminRole,
        email: data.user.email,
        accountType: data.user.accountType,
        accountStatus: data.user.accountStatus,
        dateCreated: data.user.dateCreated,
        lastUpdated: data.user.lastUpdated,
      };
      return internalUser;
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

export const useDeleteInternalUser = () => {
  return useMutation({
    mutationFn: async (userId: number) => {
      return (
        await axios.delete(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${INTERNAL_USER_API}/${userId}`,
        )
      ).data;
    },
  });
};

export const useUpdateInternalUser = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      return (
        await axios.patch(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${INTERNAL_USER_API}/${payload.userId}`,
          payload,
        )
      ).data;
    },
    onSuccess: (data) => {
      const internalUser: InternalUser = {
        userId: data.user.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        adminRole: data.adminRole,
        email: data.user.email,
        accountType: data.user.accountType,
        accountStatus: data.user.accountStatus,
        dateCreated: data.user.dateCreated,
        lastUpdated: data.user.lastUpdated,
      };
      queryClient.setQueryData<InternalUser[]>(
        ["internal-users"],
        (old = []) => {
          const oldDataIndex = old.findIndex(
            (oldUsers) => oldUsers.userId === data.userId,
          );
          if (oldDataIndex === -1) return old;

          old[oldDataIndex] = { ...internalUser }; // replaces old cached info with newly updated info
          return old;
        },
      );
      queryClient.setQueryData(["internal-users", data.userId], internalUser);
    },
  });
};
