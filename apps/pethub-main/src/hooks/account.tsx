import { QueryClient, useMutation } from "@tanstack/react-query";
import api from "@/api/axiosConfig";

const USERS_API = "users";

export const useDeactivateAccount = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(([key]) => !["userId"].includes(key)),
      );
      return (
        await api.patch(
          `/${USERS_API}/${payload.userId}/deactivate-user`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};

export const useActivateAccount = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(([key]) => !["userId"].includes(key)),
      );
      return (
        await api.patch(
          `/${USERS_API}/${payload.userId}/activate-user`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};
