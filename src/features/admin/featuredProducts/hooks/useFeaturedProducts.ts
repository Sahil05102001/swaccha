import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    addFeaturedProduct,
    deleteFeaturedProduct,
    getFeaturedProducts,
    updateFeaturedProduct,
} from "../services/featuredProductService";

import type { FeaturedProductFormData } from "../types/featuredProduct";

export const FEATURED_PRODUCTS_QUERY_KEY = [
    "featured-products",
];

export function useFeaturedProducts() {
    return useQuery({
        queryKey: FEATURED_PRODUCTS_QUERY_KEY,
        queryFn: getFeaturedProducts,
    });
}

export function useAddFeaturedProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            data: FeaturedProductFormData
        ) => addFeaturedProduct(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:
                    FEATURED_PRODUCTS_QUERY_KEY,
            });
        },
    });
}

export function useUpdateFeaturedProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: FeaturedProductFormData;
        }) =>
            updateFeaturedProduct(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:
                    FEATURED_PRODUCTS_QUERY_KEY,
            });
        },
    });
}

export function useDeleteFeaturedProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFeaturedProduct,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:
                    FEATURED_PRODUCTS_QUERY_KEY,
            });
        },
    });
}