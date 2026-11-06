import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getShippingSettings,
  saveShippingSettings,
} from "../services/shippingService";

const KEY = ["shipping-settings"] as const;

export function useShippingSettings() {
  return useQuery({
    queryKey: KEY,
    queryFn: getShippingSettings,
    staleTime: 5 * 60_000,
  });
}

export function useSaveShippingSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveShippingSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}