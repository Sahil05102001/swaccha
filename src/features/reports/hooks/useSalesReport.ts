import { useQuery } from "@tanstack/react-query";

import { getSalesReport } from "../services/salesReportService";
import type { SalesReportFilters } from "../services/salesReportService";

export const SALES_REPORT_QUERY_KEY = [
    "sales-report",
] as const;

export function useSalesReport(
    filters?: SalesReportFilters
) {
    return useQuery({
        queryKey: [
            ...SALES_REPORT_QUERY_KEY,
            {
                startDate:
                    filters?.startDate?.toISOString() ??
                    null,
                endDate:
                    filters?.endDate?.toISOString() ??
                    null,
                search:
                    filters?.search?.trim() ?? "",
                orderStatus:
                    filters?.orderStatus ?? "",
                paymentStatus:
                    filters?.paymentStatus ?? "",
            },
        ],
        queryFn: () =>
            getSalesReport(filters),
    });
}