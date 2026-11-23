import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getTaxSettings, saveTaxSettings } from "../services/taxService";

const KEY = ["tax-settings"] as const;

export function useTaxSettings() {
  return useQuery({
    queryKey: KEY,
    queryFn: getTaxSettings,
    staleTime: 5 * 60_000,
  });
}

export function useSaveTaxSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveTaxSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}