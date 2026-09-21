import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCategory } from "../services/categoryService";

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["active-categories"],
        }),
      ]);
    },
  });
}