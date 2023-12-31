import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { AccountStatusEnum } from "shared-utils";
import { ServiceListing } from "shared-utils";
import api from "@/api/axiosConfig";
import {
  CheckoutSpotlightListingPayload,
  CreateServiceListingPayload,
  UpdateServiceListingPayload,
} from "@/types/types";

const SERVICE_LISTING_API = "/service-listings";

// POST Service Listing
export const useCreateServiceListing = () => {
  return useMutation({
    mutationFn: async (payload: CreateServiceListingPayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("petBusinessId", payload.petBusinessId.toString());
      formData.append("category", payload.category);
      formData.append("basePrice", payload.basePrice.toString());
      if (payload.calendarGroupId)
        formData.append("calendarGroupId", payload.calendarGroupId.toString());
      if (payload.duration)
        formData.append("duration", payload.duration.toString());
      if (payload.defaultExpiryDays)
        formData.append(
          "defaultExpiryDays",
          payload.defaultExpiryDays.toString(),
        );
      if (payload.lastPossibleDate)
        formData.append("lastPossibleDate", payload.lastPossibleDate);
      formData.append("requiresBooking", payload.requiresBooking.toString());
      payload.tagIds.forEach((tagId) => {
        formData.append("tagIds[]", tagId.toString());
      });

      // Add files to the form data
      payload.files.forEach((file) => {
        formData.append("file", file);
      });

      payload.addressIds.forEach((address) => {
        formData.append("addressIds[]", address.toString());
      });

      const response = await api.post(`${SERVICE_LISTING_API}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
  });
};

// GET All Service Listings with Query Params
export const useGetAllServiceListingsWithQueryParams = (
  categoryValue?: string,
  tagNames?: string[],
) => {
  const params = { category: categoryValue, tag: { ...tagNames } };
  return useQuery({
    queryKey: ["service-listings", { params }],
    queryFn: async () => {
      const response = await api.get(`${SERVICE_LISTING_API}/active`, {
        params,
      });
      return response.data as ServiceListing[];
    },
  });
};

// GET Service Listing by Business Id
export const useGetServiceListingByPetBusinessId = (
  userId: number,
  isPB?: boolean,
) => {
  return useQuery({
    queryKey: ["service-listings", { petBusinessId: userId }],
    queryFn: async () => {
      const response = await api.get(
        `${SERVICE_LISTING_API}/pet-businesses/${userId}`,
        {
          params: { isPB }, // Include isPB in the query string if it's defined
        },
      );
      return response.data as ServiceListing[];
    },
  });
};

export const useGetServiceListingById = (serviceListingId: number) => {
  return useQuery({
    queryKey: ["service-listing", serviceListingId],
    queryFn: async () => {
      const response = await api.get(
        `${SERVICE_LISTING_API}/${serviceListingId}`,
      );
      return response.data as ServiceListing;
    },
  });
};

// GET Service Listing by Business Id and Account Status, ensure PB is ACTIVE
export const useGetServiceListingByPetBusinessIdAndAccountStatus = (
  userId: number,
  accountStatus: AccountStatusEnum,
) => {
  return useQuery({
    queryKey: ["service-listings", { petBusinessId: userId }, accountStatus],
    queryFn: async () => {
      const response = await api.get(
        `${SERVICE_LISTING_API}/pet-businesses/${userId}`,
      );
      return response.data as ServiceListing[];
    },
    enabled: accountStatus === AccountStatusEnum.Active,
  });
};

// PATCH Service Listing by Service Id
export const useUpdateServiceListing = () => {
  return useMutation({
    mutationFn: async (payload: UpdateServiceListingPayload) => {
      // Extract the serviceListingId from the payload
      const { serviceListingId, ...payloadWithoutId } = payload;

      // Create a new FormData object to build the request body
      const formData = new FormData();

      // Append fields to the formData
      formData.append("title", payloadWithoutId.title);
      formData.append("description", payloadWithoutId.description);
      formData.append("category", payloadWithoutId.category);
      formData.append("basePrice", payloadWithoutId.basePrice.toString());
      if (payload.calendarGroupId)
        formData.append(
          "calendarGroupId",
          payloadWithoutId.calendarGroupId.toString(),
        );
      if (payload.duration)
        formData.append("duration", payload.duration.toString());
      formData.append("requiresBooking", payload.requiresBooking.toString());
      if (payload.defaultExpiryDays)
        formData.append(
          "defaultExpiryDays",
          payload.defaultExpiryDays.toString(),
        );
      if (payload.lastPossibleDate)
        formData.append("lastPossibleDate", payload.lastPossibleDate);
      // Append tagIds as an array
      payloadWithoutId.tagIds.forEach((tagId) => {
        formData.append("tagIds[]", tagId.toString());
      });

      payload.addressIds.forEach((address) => {
        formData.append("addressIds[]", address.toString());
      });

      // Append files to the formData
      payloadWithoutId.files.forEach((file) => {
        formData.append("file", file);
      });

      // Send the PATCH request with formData
      return (
        await api.patch(
          `${SERVICE_LISTING_API}/${serviceListingId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        )
      ).data;
    },
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
  });
};

// spotlight a service listing, with stripe payment
export const useStripeBumpServiceListing = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: CheckoutSpotlightListingPayload) => {
      const { serviceListingId, ...payloadWithoutId } = payload;
      return (
        await api.patch(
          `${SERVICE_LISTING_API}/${serviceListingId}/bump`,
          payloadWithoutId,
        )
      ).data;
    },
    onError: (error) => {
      console.error("Error: ", error);
      throw error;
    },
  });
};
