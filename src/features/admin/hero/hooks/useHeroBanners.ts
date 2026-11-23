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
  type HeroImageFiles,
} from "../services/heroBannerService";

import type {
  HeroBanner,
  HeroBannerFormData,
} from "../types/heroBanner";

export const HERO_BANNERS_QUERY_KEY = ["hero-banners"];

export function useHeroBanners() {
  return useQuery({
    queryKey: HERO_BANNERS_QUERY_KEY,
    queryFn: getHeroBanners,
  });
}

export function useAddHeroBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      files,
    }: {
      data: HeroBannerFormData;
      files: HeroImageFiles;
    }) => addHeroBanner(data, files),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: HERO_BANNERS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateHeroBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      files,
      previous,
    }: {
      id: string;
      data: HeroBannerFormData;
      files: HeroImageFiles;
      previous: HeroBanner;
    }) => updateHeroBanner(id, data, files, previous),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: HERO_BANNERS_QUERY_KEY,
      });
    },
  });
}

export function useDeleteHeroBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteHeroBanner(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: HERO_BANNERS_QUERY_KEY,
      });
    },
  });
}