import { useQuery } from "@tanstack/react-query";

import { getTopSellingProducts } from "../services/dashboardTopProductsService";

export const TOP_SELLING_PRODUCTS_QUERY_KEY = [
    "top-selling-products",
];

export function useTopSellingProducts() {
    return useQuery({
        queryKey: TOP_SELLING_PRODUCTS_QUERY_KEY,
        queryFn: getTopSellingProducts,
    });
}