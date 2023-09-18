import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ChangePasswordPayload } from "./types";

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
