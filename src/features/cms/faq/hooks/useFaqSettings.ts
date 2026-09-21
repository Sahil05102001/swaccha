import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { FaqSettings } from "../types/faq";

import {
  getFaqSettings,
  saveFaqSettings,
} from "../services/faqService";

const QUERY_KEY = ["cms", "faq"];

export function useFaqSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getFaqSettings,
  });

  const mutation = useMutation({
    mutationFn: (settings: FaqSettings) =>
      saveFaqSettings(settings),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  return {
    faqSettings: query.data,

    isLoading: query.isLoading,

    isSaving: mutation.isPending,

    saveFaqSettings: mutation.mutateAsync,

    error: query.error,
  };
}