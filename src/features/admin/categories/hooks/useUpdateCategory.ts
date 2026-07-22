import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCategory } from "../services/categoryService";

import type { CategoryFormData } from "../types/category";

interface UpdateCategoryPayload {
  id: string;
  category: CategoryFormData;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      category,
    }: UpdateCategoryPayload) =>
      updateCategory(id, category),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}