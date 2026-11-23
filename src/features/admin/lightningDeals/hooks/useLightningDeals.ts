import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createLightningDeal,
  deleteLightningDeal,
  getLightningDeals,
  getLightningDealsSettings,
  saveLightningDealsSettings,
  updateLightningDeal,
} from "../services/lightningDealService";

import type {
  LightningDealFormData,
  LightningDealsSettings,
} from "../types/lightningDeal";

export const LIGHTNING_DEALS_KEY = ["lightning-deals"];
export const LIGHTNING_SETTINGS_KEY = ["lightning-deals-settings"];

export function useLightningDeals() {
  return useQuery({
    queryKey: LIGHTNING_DEALS_KEY,
    queryFn: getLightningDeals,
  });
}

export function useLightningDealsSettings() {
  return useQuery({
    queryKey: LIGHTNING_SETTINGS_KEY,
    queryFn: getLightningDealsSettings,
  });
}

export function useCreateLightningDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LightningDealFormData) => createLightningDeal(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: LIGHTNING_DEALS_KEY }),
  });
}

export function useUpdateLightningDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LightningDealFormData }) =>
      updateLightningDeal(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: LIGHTNING_DEALS_KEY }),
  });
}

export function useDeleteLightningDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLightningDeal(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: LIGHTNING_DEALS_KEY }),
  });
}

export function useSaveLightningDealsSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LightningDealsSettings) =>
      saveLightningDealsSettings(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: LIGHTNING_SETTINGS_KEY }),
  });
}