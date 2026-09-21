import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getPolicy,
  savePolicy,
} from "../services/policyService";

import type { PolicySettings } from "../types/policy";

export function usePolicy(
  documentId: string,
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["policy", documentId],
    queryFn: () => getPolicy(documentId),
  });

  const mutation = useMutation({
    mutationFn: (data: PolicySettings) =>
      savePolicy(documentId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "policy",
          documentId,
        ],
      });
    },
  });

  return {
    policy: query.data,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    savePolicy: mutation.mutateAsync,
    error: query.error,
  };
}