import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getBrandStatement,
    saveBrandStatement,
} from "../services/brandStatementService";

import type { BrandStatementFormData } from "../types/brandStatement";

export const BRAND_STATEMENT_QUERY_KEY = [
    "brand-statement",
];

export function useBrandStatement() {
    return useQuery({
        queryKey: BRAND_STATEMENT_QUERY_KEY,
        queryFn: getBrandStatement,
    });
}

export function useSaveBrandStatement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BrandStatementFormData) =>
            saveBrandStatement(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: BRAND_STATEMENT_QUERY_KEY,
            });
        },
    });
}