import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createBestSeller,
  deleteBestSeller,
  getBestSellers,
  updateBestSeller,
} from "../services/bestSellerService";

import type {
  BestSellerFormData,
} from "../types/bestSeller";

export const BEST_SELLERS_QUERY_KEY = [
  "best-sellers",
];

export function useBestSellers() {
  return useQuery({
    queryKey: BEST_SELLERS_QUERY_KEY,
    queryFn: getBestSellers,
  });
}

export function useCreateBestSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: BestSellerFormData,
    ) => createBestSeller(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BEST_SELLERS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateBestSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: BestSellerFormData;
    }) =>
      updateBestSeller(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BEST_SELLERS_QUERY_KEY,
      });
    },
  });
}

export function useDeleteBestSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteBestSeller(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BEST_SELLERS_QUERY_KEY,
      });
    },
  });
}