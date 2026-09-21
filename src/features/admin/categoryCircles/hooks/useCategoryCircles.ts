import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createCategoryCircle,
  deleteCategoryCircle,
  getCategoryCircles,
  updateCategoryCircle,
} from "../services/categoryCircleService";

import type {
  CategoryCircleFormData,
} from "../types/categoryCircle";

export const CATEGORY_CIRCLES_QUERY_KEY = [
  "category-circles",
];

export function useCategoryCircles() {
  return useQuery({
    queryKey: CATEGORY_CIRCLES_QUERY_KEY,
    queryFn: getCategoryCircles,
  });
}

export function useCreateCategoryCircle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CategoryCircleFormData,
    ) => createCategoryCircle(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_CIRCLES_QUERY_KEY,
      });
    },
  });
}

export function useUpdateCategoryCircle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CategoryCircleFormData;
    }) =>
      updateCategoryCircle(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_CIRCLES_QUERY_KEY,
      });
    },
  });
}

export function useDeleteCategoryCircle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteCategoryCircle(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_CIRCLES_QUERY_KEY,
      });
    },
  });
}