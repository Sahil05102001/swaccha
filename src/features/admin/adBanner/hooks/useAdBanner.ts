import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdBanner,
  saveAdBanner,
} from "../services/adBannerService";

import type {
  AdBannerFormData,
} from "../types/adBanner";

export const AD_BANNER_QUERY_KEY = [
  "ad-banner",
];

export function useAdBanner() {
  return useQuery({
    queryKey: AD_BANNER_QUERY_KEY,
    queryFn: getAdBanner,
  });
}

export function useSaveAdBanner() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: AdBannerFormData
    ) => saveAdBanner(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          AD_BANNER_QUERY_KEY,
      });
    },
  });
}