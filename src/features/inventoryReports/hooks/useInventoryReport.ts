import { useQuery } from "@tanstack/react-query";

import {
    getInventoryReport,
} from "../services/inventoryReportService";

import type {
    InventoryReportFilters,
} from "../services/inventoryReportService";

export const INVENTORY_REPORT_QUERY_KEY = [
    "inventory-report",
] as const;

export function useInventoryReport(
    filters?: InventoryReportFilters
) {
    return useQuery({
        queryKey: [
            ...INVENTORY_REPORT_QUERY_KEY,
            {
                search:
                    filters?.search?.trim() ?? "",
                category:
                    filters?.category ?? "",
                stockStatus:
                    filters?.stockStatus ?? "",
            },
        ],
        queryFn: () =>
            getInventoryReport(filters),
    });
}