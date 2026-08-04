import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAboutSettings,
  saveAboutSettings,
} from "../services/aboutService";

import type { AboutSettings } from "../types/about";

const ABOUT_SETTINGS_QUERY_KEY = [
  "about-settings",
];

export function useAboutSettings() {
  return useQuery({
    queryKey: ABOUT_SETTINGS_QUERY_KEY,
    queryFn: getAboutSettings,
  });
}

export function useSaveAboutSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      settings: AboutSettings,
    ) => saveAboutSettings(settings),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          ABOUT_SETTINGS_QUERY_KEY,
      });
    },
  });
}