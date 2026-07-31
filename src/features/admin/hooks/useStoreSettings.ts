import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getStoreSettings,
  saveStoreSettings,
} from "../services/storeSettingsService";

import type { StoreSettings } from "../types/storeSettings";

const STORE_SETTINGS_QUERY_KEY = [
  "store-settings",
];

export function useStoreSettings() {
  return useQuery({
    queryKey: STORE_SETTINGS_QUERY_KEY,
    queryFn: getStoreSettings,
  });
}

export function useSaveStoreSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      settings: StoreSettings,
    ) => saveStoreSettings(settings),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORE_SETTINGS_QUERY_KEY,
      });
    },
  });
}