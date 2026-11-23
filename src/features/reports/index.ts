export { default as SalesReportPage } from "./pages/SalesReportPage";

export { default as DateRangeFilter } from "./components/DateRangeFilter";
export { default as ReportDownloadMenu } from "./components/ReportDownloadMenu";
export { default as ReportSummaryCards } from "./components/ReportSummaryCards";
export { default as SalesReportTable } from "./components/SalesReportTable";

export { useSalesReport } from "./hooks/useSalesReport";

export { fetchSalesReportRows, buildSalesReport } from "./services/salesReportService";

export type {
  SalesReport,
  SalesReportFilters,
  SalesReportRow,
  SalesReportSummary,
} from "./services/salesReportService";

export type { DateRangeFilterValue } from "./components/DateRangeFilter";