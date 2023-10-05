import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ServiceListing } from "shared-utils";
import api from "@/api/axiosConfig";

const SERVICE_LISTING_API = "/service-listings";

export const useGetAllServiceListings = () => {
  return useQuery({
    queryKey: ["service-listings"],
    queryFn: async () =>
      (await api.get(`${SERVICE_LISTING_API}`)).data as ServiceListing[],
  });
};

// Delete Service Listing by Service Id
export const useDeleteServiceListingById = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (serviceListingId: number) => {
      return (await api.delete(`${SERVICE_LISTING_API}/${serviceListingId}`))
        .data;
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
