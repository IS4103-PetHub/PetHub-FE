import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import {
  CreateServiceListingPayload,
  ServiceListing,
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
    onSuccess: () => {
      console.log("Successfully created service listing");
    },
    onError: (error) => {
      console.error("Error creating service listing:", error);
      throw error;
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
    queryKey: ["service-listings", categoryValue, tagNames],
    queryFn: async () => {
      if (
        (categoryValue && categoryValue.length > 0) ||
        (tagNames && tagNames.length > 0)
      ) {
        return (await (
          await axios.get(
            `${process.env.NEXT_PUBLIC_DEV_API_URL}/${SERVICE_LISTING_API}/filter`,
            { params },
          )
        ).data) as ServiceListing[];
      } else {
        return (await (
          await axios.get(
            `${process.env.NEXT_PUBLIC_DEV_API_URL}/${SERVICE_LISTING_API}`,
          )
        ).data) as ServiceListing[];
      }
    },
  });
};

// GET Service Listing by Business Id
export const useGetServiceListingByPetBusinessId = (userId: number) => {
  return useQuery({
    queryKey: ["service-listings"],
    queryFn: async () => {
      const response = await api.get(
        `${SERVICE_LISTING_API}/pet-businesses/${userId}`,
      );
      return response.data as ServiceListing[];
    },
  });
};

// PATCH Service Listing by Service Id
export const useUpdateServiceListing = (queryClient: QueryClient) => {
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
    onError: (error) => {
      console.error("Error deleting service listing:", error);
      throw error;
    },
  });
};
