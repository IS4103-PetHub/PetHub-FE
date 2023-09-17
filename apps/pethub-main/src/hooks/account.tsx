import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

const USERS_API = "api/users";

export const useDeactivateAccount = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(([key]) => !["userId"].includes(key)),
      );
      return (
        await axios.patch(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${USERS_API}/${payload.userId}/deactivate-user`,
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
        await axios.patch(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${USERS_API}/${payload.userId}/activate-user`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};
