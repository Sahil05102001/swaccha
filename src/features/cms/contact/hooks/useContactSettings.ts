import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getContactSettings,
  saveContactSettings,
} from "../services/contactService";

import type { ContactSettings } from "../types/contact";

const QUERY_KEY = ["cms", "contact"];

export function useContactSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getContactSettings,
  });

  const mutation = useMutation({
    mutationFn: (settings: ContactSettings) =>
      saveContactSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  return {
    contactSettings: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,

    saveContactSettings: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}