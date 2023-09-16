import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CreateUserGroupPayload, Permission, UserGroup } from "@/types/types";

const RBAC_USER_GROUPS_API = "api/rbac/user-groups";
const RBAC_PERMISSIONS_API = "api/rbac/permissions";

export const useGetAllUserGroups = () => {
  return useQuery({
    queryKey: ["user-groups"],
    queryFn: async () =>
      (
        await axios.get(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${RBAC_USER_GROUPS_API}`,
        )
      ).data as UserGroup[],
  });
};

export const useCreateUserGroup = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CreateUserGroupPayload) => {
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${RBAC_USER_GROUPS_API}`,
          payload,
        )
      ).data;
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

export const useUpdateUserGroup = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(([key]) => !["groupId"].includes(key)),
      );
      return (
        await axios.patch(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${RBAC_USER_GROUPS_API}/${payload.groupId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};

export const useDeleteUserGroup = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (id: number) => {
      return (
        await axios.delete(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${RBAC_USER_GROUPS_API}/${id}`,
        )
      ).data;
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
      return (
        await axios.get(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${RBAC_USER_GROUPS_API}/${id}`,
        )
      ).data as UserGroup;
    },
  });
};

// permissions hook

export const useGetAllPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () =>
      (
        await axios.get(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${RBAC_PERMISSIONS_API}`,
        )
      ).data as Permission[],
  });
};

// assign and unassign users

export const useAddMultipleUsersToUserGroup = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(([key]) => !["groupId"].includes(key)),
      );
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${RBAC_USER_GROUPS_API}/${payload.groupId}/add-users`,
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
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${RBAC_USER_GROUPS_API}/${payload.groupId}/remove-user/${payload.userId}`,
        )
      ).data;
    },
  });
};
