import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { AccountStatusEnum } from "shared-utils";
import { ServiceListing } from "shared-utils";
import api from "@/api/axiosConfig";
import {
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
      formData.append("calendarGroupId", payload.calendarGroupId.toString());
      formData.append("duration", payload.duration.toString());
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
      if (categoryValue || (tagNames && tagNames.length > 0)) {
        const response = await api.get(`${SERVICE_LISTING_API}/active`, {
          params,
        });
        return response.data as ServiceListing[];
      } else {
        const response = await api.get(`${SERVICE_LISTING_API}/active`);
        return response.data as ServiceListing[];
      }
    },
  });
};

// GET Service Listing by Business Id
export const useGetServiceListingByPetBusinessId = (userId: number) => {
  return useQuery({
    queryKey: ["service-listings", { petBusinessId: userId }],
    queryFn: async () => {
      const response = await api.get(
        `${SERVICE_LISTING_API}/pet-businesses/${userId}`,
      );
      return response.data as ServiceListing[];
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
      formData.append(
        "calendarGroupId",
        payloadWithoutId.calendarGroupId.toString(),
      );
      formData.append("duration", payload.duration.toString());
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
