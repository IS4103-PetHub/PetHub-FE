import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ServiceListing } from "@/types/types";

const SERVICE_LISTING_API = "api/service-listings";

export const useGetAllServiceListings = () => {
  return useQuery({
    queryKey: ["service-listings"],
    queryFn: async () =>
      (
        await axios.get(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${SERVICE_LISTING_API}`,
        )
      ).data as ServiceListing[],
  });
};

// Delete Service Listing by Service Id
export const useDeleteServiceListingById = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (serviceListingId: number) => {
      return (
        await axios.delete(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${SERVICE_LISTING_API}/${serviceListingId}`,
        )
      ).data;
    },
    onSuccess: (data, serviceListingId) => {
      queryClient.setQueryData<ServiceListing[]>(
        ["service-listings"],
        (oldServiceListings = []) => {
          return oldServiceListings.filter(
            (listing) => listing.serviceListingId !== serviceListingId,
          );
        },
      );
    },
    onError: (error) => {
      console.error("Error deleting service listing:", error);
      throw error;
    },
  });
};
