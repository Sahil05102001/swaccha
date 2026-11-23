import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  buildInventoryReport,
  fetchInventoryRows,
  type InventoryReportFilters,
  type InventoryReportRow,
} from "../services/inventoryReportService";

export const INVENTORY_REPORT_QUERY_KEY = ["inventory-report"] as const;

/** Products download once. Search, category and status filter on screen. */
export function useInventoryReport(filters: InventoryReportFilters) {
  const select = useCallback(
    (rows: InventoryReportRow[]) => buildInventoryReport(rows, filters),
    [filters],
  );

  return useQuery({
    queryKey: INVENTORY_REPORT_QUERY_KEY,
    queryFn: fetchInventoryRows,
    select,
    staleTime: 30_000,
    retry: false,
  });
}