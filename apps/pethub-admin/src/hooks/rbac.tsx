import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { AccountTypeEnum } from "shared-utils";
import api from "@/api/axiosConfig";
import { CreateUserGroupPayload, Permission, UserGroup } from "@/types/types";

const RBAC_USER_GROUPS_API = "/rbac/user-groups";
const RBAC_PERMISSIONS_API = "/rbac/permissions";

export const useGetAllUserGroups = () => {
  return useQuery({
    queryKey: ["user-groups"],
    queryFn: async () =>
      (await api.get(`${RBAC_USER_GROUPS_API}`)).data as UserGroup[],
  });
};

export const useCreateUserGroup = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CreateUserGroupPayload) => {
      return (await api.post(`${RBAC_USER_GROUPS_API}`, payload)).data;
    },
    onSuccess: (data) => {
      const newUserGroup: UserGroup = {
        groupId: data.groupId,
        name: data.name,
        description: data.description,
      };
      queryClient.setQueryData<UserGroup[]>(["user-groups"], (old = []) => {
        return [...old, newUserGroup];
        // appends newly created record to cache
      });
    },
  });
};

export const useUpdateUserGroup = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { groupId, ...payloadWithoutId } = payload;
      return (
        await api.patch(`${RBAC_USER_GROUPS_API}/${groupId}`, payloadWithoutId)
      ).data;
    },
    onSuccess: (data) => {
      const userGroup: UserGroup = {
        groupId: data.groupId,
        name: data.name,
        description: data.description,
      };
      queryClient.setQueryData<UserGroup[]>(["user-groups"], (old = []) => {
        const oldDataIndex = old.findIndex(
          (oldGroup) => oldGroup.groupId === data.groupId,
        );
        if (oldDataIndex === -1) return old;

        old[oldDataIndex] = { ...userGroup }; // replaces old cached info with newly updated info
        return old;
      });
    },
  });
};

export const useDeleteUserGroup = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (await api.delete(`${RBAC_USER_GROUPS_API}/${id}`)).data;
    },
    onSuccess: (data, id) => {
      queryClient.setQueryData<UserGroup[]>(["user-groups"], (old = []) => {
        return old.filter((group) => group.groupId !== id);
        // removes deleted record from cache
      });
    },
  });
};

export const useGetUserGroupById = (id: number) => {
  return useQuery({
    queryKey: ["user-groups", id],
    queryFn: async () => {
      return (await api.get(`${RBAC_USER_GROUPS_API}/${id}`)).data as UserGroup;
    },
  });
};

// permissions hook

export const useGetAllPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () =>
      (await api.get(`${RBAC_PERMISSIONS_API}`)).data as Permission[],
  });
};

// assign and unassign users

export const useAddMultipleUsersToUserGroup = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { groupId, ...payloadWithoutId } = payload;
      return (
        await api.post(
          `${RBAC_USER_GROUPS_API}/${groupId}/add-users`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};

export const useRemoveUserFromUserGroup = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      return (
        await api.post(
          `${RBAC_USER_GROUPS_API}/${payload.groupId}/remove-user/${payload.userId}`,
        )
      ).data;
    },
  });
};

export const useGetPermissionsByUserIdAndAccountType = (
  userId: number,
  accountType: AccountTypeEnum,
) => {
  return useQuery({
    queryKey: ["permissions", userId, accountType],
    queryFn: async () =>
      (await api.get(`/rbac/users/${userId}/permissions`)).data as Permission[],
    enabled: accountType === AccountTypeEnum.InternalUser,
  });
};
