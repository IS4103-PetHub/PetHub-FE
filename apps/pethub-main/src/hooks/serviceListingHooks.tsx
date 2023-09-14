import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AccountTypeEnum } from "@/types/constants";
import { CreateServiceListingPayload, ServiceListing } from "@/types/types";

const SERVICE_LISTING_API = "api/service-listings";

// POST Service Listing
export const useCreateServiceListing = () => {
  return useMutation({
    mutationFn: async (payload: CreateServiceListingPayload) => {
      return (
        await axios.post(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${SERVICE_LISTING_API}/`,
          payload,
        )
      ).data;
    },
  });
};

// GET Service Listing by Business Id
export const useGetServiceListingByPetBusinessIdAndAccountType = (
  userId: number,
) => {
  return useQuery({
    queryKey: ["service-listings", userId],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/${SERVICE_LISTING_API}/pet-businesses/${userId}`,
      );
      return response.data;
    },
  });
};

// PATCH Service Listing by Serivce Id
export const useUpdateServiceListing = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const payloadWithoutId = Object.fromEntries(
        Object.entries(payload).filter(
          ([key]) => !["serviceListingId"].includes(key),
        ),
      );
      return (
        await axios.patch(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/${SERVICE_LISTING_API}/${payload.serviceListingId}`,
          payloadWithoutId,
        )
      ).data;
    },
  });
};

// Delete Service Listing by Service Id
export const useDeleteServiceListingById = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (serviceListingId: number) => {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/${SERVICE_LISTING_API}/${serviceListingId}`,
      );
      return serviceListingId;
    },
    onMutate: (serviceListingId) => {
      queryClient.setQueryData(["service-listings", serviceListingId], null);
      return { serviceListingId };
    },
    onSuccess: (serviceListingId) => {
      queryClient.invalidateQueries(["service-listings", serviceListingId]);
    },
    onError: (error) => {
      console.error("Error deleting service listing:", error);
      throw error;
    },
  });
};
