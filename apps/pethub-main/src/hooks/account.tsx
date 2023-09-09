import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ChangePasswordPayload } from "@/types/types";

export const useChangePassword = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/change-password`,
          payload,
        )
      ).data;
    },
  });
};

export const useDeactivateAccount = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(([key]) => !["userId"].includes(key)),
      );
      return (
        await axios.patch(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/${payload.userId}/deactivate-user`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};
