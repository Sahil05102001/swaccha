import { useQuery } from "@tanstack/react-query";

import { getDashboardCharts } from "../services/dashboardChartsService";

export const DASHBOARD_CHARTS_QUERY_KEY = [
  "dashboard-charts",
];

export function useDashboardCharts() {
  return useQuery({
    queryKey: DASHBOARD_CHARTS_QUERY_KEY,
    queryFn: getDashboardCharts,
  });
}