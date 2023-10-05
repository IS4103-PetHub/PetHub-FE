import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { CreateInternalUserPayload, InternalUser } from "@/types/types";

const INTERNAL_USER_API = "/users/internal-users";

export const useGetAllInternalUsers = () => {
  return useQuery({
    queryKey: ["internal-users"],
    queryFn: async () => {
      const { data } = await api.get(`${INTERNAL_USER_API}`);
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
      const data = await (await api.get(`${INTERNAL_USER_API}/${userId}`)).data;
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
      return (await api.post(`${INTERNAL_USER_API}`, payload)).data;
    },
  });
};

export const useDeleteInternalUser = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (userId: number) => {
      return (await api.delete(`${INTERNAL_USER_API}/${userId}`)).data;
    },
    onSuccess: (data, userId) => {
      queryClient.setQueryData<InternalUser[]>(
        ["internal-users"],
        (old = []) => {
          return old.filter((user) => user.userId !== userId);
          // removes deleted record from cache
        },
      );
    },
  });
};

export const useUpdateInternalUser = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      return (
        await api.patch(`${INTERNAL_USER_API}/${payload.userId}`, payload)
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
      queryClient.setQueryData(["internal-users", data.userId], internalUser);
    },
  });
};
