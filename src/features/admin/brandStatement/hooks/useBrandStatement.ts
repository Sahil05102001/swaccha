import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getBrandStatement,
  saveBrandStatement,
  type SaveBrandStatementInput,
} from "../services/brandStatementService";

export const BRAND_STATEMENT_QUERY_KEY = ["brand-statement"];

export function useBrandStatement() {
  return useQuery({
    queryKey: BRAND_STATEMENT_QUERY_KEY,
    queryFn: getBrandStatement,
  });
}

export function useSaveBrandStatement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveBrandStatementInput) => saveBrandStatement(input),

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: BRAND_STATEMENT_QUERY_KEY }),
  });
}