import { useCallback } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  buildSalesReport,
  fetchSalesReportRows,
  type SalesReportFilters,
  type SalesReportRaw,
} from "../services/salesReportService";

export const SALES_REPORT_QUERY_KEY = ["sales-report"] as const;

/** Only the date range triggers a download. Search and status filter on screen. */
export function useSalesReport(filters: SalesReportFilters) {
  const select = useCallback(
    (raw: SalesReportRaw) => buildSalesReport(raw, filters),
    [filters],
  );

  return useQuery({
    queryKey: [
      ...SALES_REPORT_QUERY_KEY,
      {
        start: filters.startDate?.getTime() ?? null,
        end: filters.endDate?.getTime() ?? null,
      },
    ],
    queryFn: () =>
      fetchSalesReportRows({
        startDate: filters.startDate,
        endDate: filters.endDate,
      }),
    select,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    retry: false,
  });
}