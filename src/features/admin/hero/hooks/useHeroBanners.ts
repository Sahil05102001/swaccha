import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addHeroBanner,
  deleteHeroBanner,
  getHeroBanners,
  updateHeroBanner,
} from "../services/heroBannerService";

import type {
  HeroBannerFormData,
} from "../types/heroBanner";

export const HERO_BANNERS_QUERY_KEY = [
  "hero-banners",
];

export function useHeroBanners() {
  return useQuery({
    queryKey: HERO_BANNERS_QUERY_KEY,
    queryFn: getHeroBanners,
  });
}

export function useAddHeroBanner() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: HeroBannerFormData
    ) => addHeroBanner(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          HERO_BANNERS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateHeroBanner() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: HeroBannerFormData;
    }) =>
      updateHeroBanner(
        id,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          HERO_BANNERS_QUERY_KEY,
      });
    },
  });
}

export function useDeleteHeroBanner() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string
    ) => deleteHeroBanner(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          HERO_BANNERS_QUERY_KEY,
      });
    },
  });
}