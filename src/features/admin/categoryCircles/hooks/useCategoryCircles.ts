import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCategoryCircle,
  deleteCategoryCircle,
  getCategoryCircles,
  updateCategoryCircle,
  type CategoryCircleInput,
} from "../services/categoryCircleService";

export const CATEGORY_CIRCLES_QUERY_KEY = ["category-circles"];

export function useCategoryCircles() {
  return useQuery({
    queryKey: CATEGORY_CIRCLES_QUERY_KEY,
    queryFn: getCategoryCircles,
  });
}

export function useCreateCategoryCircle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CategoryCircleInput) => createCategoryCircle(input),

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CATEGORY_CIRCLES_QUERY_KEY }),
  });
}

export function useUpdateCategoryCircle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CategoryCircleInput }) =>
      updateCategoryCircle(id, input),

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CATEGORY_CIRCLES_QUERY_KEY }),
  });
}

export function useDeleteCategoryCircle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategoryCircle(id),

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CATEGORY_CIRCLES_QUERY_KEY }),
  });
}