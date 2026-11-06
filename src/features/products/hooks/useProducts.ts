import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getProductsPage,
  updateProduct,
  updateProductFeatured,
} from "../services/productService";

import type { ProductFormData } from "../schemas/productSchema";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}

export function usePaginatedProducts(
  pageSize: number,
  lastDocument?: Parameters<typeof getProductsPage>[1]
) {
  return useQuery({
    queryKey: ["products", "paginated", pageSize, lastDocument?.id ?? "first"],
    queryFn: () => getProductsPage(pageSize, lastDocument),
    staleTime: 30_000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      product,
    }: {
      id: string;
      product: ProductFormData;
    }) => updateProduct(id, product),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

export function useUpdateProductFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isFeatured,
    }: {
      id: string;
      isFeatured: boolean;
    }) => updateProductFeatured(id, isFeatured),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}