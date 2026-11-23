import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCmsDocument,
  saveCmsDocument,
} from "@/features/cms/core/cmsService";

import {
  DEFAULT_EXCLUSIVE_OFFERS,
  type ExclusiveOffersSettings,
} from "../types/exclusiveOffers";

const DOCUMENT_ID = "exclusive-offers";

export const EXCLUSIVE_OFFERS_KEY = ["exclusive-offers"];

async function fetchExclusiveOffers(): Promise<ExclusiveOffersSettings> {
  const data = await getCmsDocument<Partial<ExclusiveOffersSettings>>(
    DOCUMENT_ID,
    DEFAULT_EXCLUSIVE_OFFERS,
  );

  return {
    ...DEFAULT_EXCLUSIVE_OFFERS,
    ...data,
    offers: Array.isArray(data.offers) ? data.offers : [],
  };
}

export function useExclusiveOffers() {
  return useQuery({
    queryKey: EXCLUSIVE_OFFERS_KEY,
    queryFn: fetchExclusiveOffers,
  });
}

export function useSaveExclusiveOffers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExclusiveOffersSettings) =>
      saveCmsDocument<ExclusiveOffersSettings>(DOCUMENT_ID, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: EXCLUSIVE_OFFERS_KEY }),
  });
}