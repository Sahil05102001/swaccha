import { useQuery } from "@tanstack/react-query";

import { getCategorySales } from "../services/dashboardCategorySalesService";

export const SALES_BY_CATEGORY_QUERY_KEY = [
    "sales-by-category",
];

export function useSalesByCategory() {
    return useQuery({
        queryKey: SALES_BY_CATEGORY_QUERY_KEY,
        queryFn: getCategorySales,
    });
}