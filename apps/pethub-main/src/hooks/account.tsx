import { useMutation } from "@tanstack/react-query";
import api from "@/api/axiosConfig";

const USERS_API = "/users";

export const useDeactivateAccount = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { userId, ...payloadWithoutId } = payload;
      return (
        await api.patch(
          `${USERS_API}/${userId}/deactivate-user`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};

export const useActivateAccount = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { userId, ...payloadWithoutId } = payload;
      return (
        await api.patch(
          `${USERS_API}/${userId}/activate-user`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};
