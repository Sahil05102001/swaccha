import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addOfferZoneProduct,
  deleteOfferZoneProduct,
  getGlobalProductStickerSettings,
  getOfferZoneProducts,
  saveGlobalProductStickerSettings,
  updateOfferZoneProduct,
} from "../services/offerZoneService";

import type {
  GlobalProductStickerSettings,
  OfferZoneProductFormData,
} from "../types/offerZone";

const OFFER_ZONE_QUERY_KEY = [
  "offerZoneProducts",
];

const PRODUCT_STICKER_SETTINGS_QUERY_KEY = [
  "productStickerSettings",
];

export function useOfferZoneProducts() {
  return useQuery({
    queryKey: OFFER_ZONE_QUERY_KEY,
    queryFn: getOfferZoneProducts,
  });
}

export function useAddOfferZoneProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: OfferZoneProductFormData
    ) => addOfferZoneProduct(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: OFFER_ZONE_QUERY_KEY,
      });
    },
  });
}

export function useUpdateOfferZoneProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: OfferZoneProductFormData;
    }) =>
      updateOfferZoneProduct(id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: OFFER_ZONE_QUERY_KEY,
      });
    },
  });
}

export function useDeleteOfferZoneProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteOfferZoneProduct(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: OFFER_ZONE_QUERY_KEY,
      });
    },
  });
}

export function useGlobalProductStickerSettings() {
  return useQuery({
    queryKey:
      PRODUCT_STICKER_SETTINGS_QUERY_KEY,
    queryFn: getGlobalProductStickerSettings,
  });
}

export function useSaveGlobalProductStickerSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      settings: GlobalProductStickerSettings
    ) =>
      saveGlobalProductStickerSettings(
        settings
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          PRODUCT_STICKER_SETTINGS_QUERY_KEY,
      });
    },
  });
}