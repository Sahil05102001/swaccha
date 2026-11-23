import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdBanner,
  saveAdBanner,
  type SaveAdBannerInput,
} from "../services/adBannerService";

export const AD_BANNER_QUERY_KEY = ["ad-banner"];

export function useAdBanner() {
  return useQuery({
    queryKey: AD_BANNER_QUERY_KEY,
    queryFn: getAdBanner,
  });
}

export function useSaveAdBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveAdBannerInput) => saveAdBanner(input),

    // Returned, so the save only finishes once fresh data is loaded.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: AD_BANNER_QUERY_KEY }),
  });
}