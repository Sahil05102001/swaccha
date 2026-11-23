import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getMaintenance,
  saveMaintenance,
} from "../services/maintenanceService";
import type { MaintenanceSettings } from "../types/maintenance";

export const MAINTENANCE_KEY = ["maintenance"] as const;

export function useMaintenance() {
  return useQuery({
    queryKey: MAINTENANCE_KEY,
    queryFn: getMaintenance,
    staleTime: 60_000,
    // An open tab notices the switch without a reload.
    refetchInterval: 120_000,
  });
}

export function useSaveMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaintenanceSettings) => saveMaintenance(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_KEY }),
  });
}