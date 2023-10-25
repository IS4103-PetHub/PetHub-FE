import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import { CommissionRule } from "@/types/types";

const COMMISSION_RULE_API = "/commission-rules";

export const useGetAllCommissionRules = () => {
  return useQuery({
    queryKey: ["commission-rules"],
    queryFn: async () => {
      const data = await api.get(`${COMMISSION_RULE_API}`);
      return data.data as CommissionRule[];
    },
  });
};

export const useCreateCommissionRule = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      return (await api.post(`${COMMISSION_RULE_API}`, payload)).data;
    },
    onSuccess: (data) => {
      const newCommissionRule: CommissionRule = {
        commissionRuleId: data.commissionRuleId,
        name: data.name,
        commissionRate: data.commissionRate,
        createdAt: data.createdAt,
      };
      queryClient.setQueryData<CommissionRule[]>(
        ["commission-rules"],
        (old = []) => {
          return [...old, newCommissionRule];
          // appends newly created record to cache
        },
      );
    },
  });
};

export const useDeleteCommissionRuleById = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (commissionRuleId: number) => {
      return (await api.delete(`${COMMISSION_RULE_API}/${commissionRuleId}`))
        .data;
    },
    onSuccess: (data, commissionRuleId) => {
      queryClient.setQueryData<CommissionRule[]>(
        ["commission-rules"],
        (oldCommissionRule = []) => {
          return oldCommissionRule.filter(
            (rule) => rule.commissionRuleId !== commissionRuleId,
          );
        },
      );
    },
  });
};

export const useGetCommissionRuleById = (commissionRuleId: number) => {
  return useQuery({
    queryKey: ["commission-rules", commissionRuleId],
    queryFn: async () => {
      const response = await api.get(
        `${COMMISSION_RULE_API}/${commissionRuleId}`,
      );
      return response.data as CommissionRule;
    },
    refetchOnMount: true,
  });
};

export const useUpdateCommissionRule = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { commissionRuleId, ...payloadWithoutId } = payload;
      return (
        await api.patch(
          `${COMMISSION_RULE_API}/${commissionRuleId}`,
          payloadWithoutId,
        )
      ).data;
    },
    onSuccess: (data) => {
      const commissionRule: CommissionRule = {
        commissionRuleId: data.commissionRuleId,
        name: data.name,
        commissionRate: data.commissionRate,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
      queryClient.setQueryData<CommissionRule[]>(
        ["commission-rules"],
        (old = []) => {
          const oldDataIndex = old.findIndex(
            (oldGroup) => oldGroup.commissionRuleId === data.commissionRuleId,
          );
          if (oldDataIndex === -1) return old;

          old[oldDataIndex] = { ...commissionRule }; // replaces old cached info with newly updated info
          return old;
        },
      );
    },
  });
};
