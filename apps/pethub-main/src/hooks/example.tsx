import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useExampleGet = () => {
  return useQuery({
    queryKey: ["example"],
    queryFn: async () =>
      (await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}`)).data,
  });
};
