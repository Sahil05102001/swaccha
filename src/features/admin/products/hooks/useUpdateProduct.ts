import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProduct } from "../services/productService";
import type { ProductFormData } from "../types/product";

interface UpdateProductPayload {
  id: string;
  product: ProductFormData;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      product,
    }: UpdateProductPayload) =>
      updateProduct(id, product),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}