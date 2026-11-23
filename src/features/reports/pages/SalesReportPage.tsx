import { useState } from "react";
import { Alert, Button, Skeleton, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";

import DateRangeFilter, {
  type DateRangeFilterValue,
} from "../components/DateRangeFilter";
import ReportDownloadMenu from "../components/ReportDownloadMenu";
import ReportSummaryCards from "../components/ReportSummaryCards";
import SalesReportTable from "../components/SalesReportTable";
import { useSalesReport } from "../hooks/useSalesReport";
import { MAX_REPORT_ORDERS } from "../services/salesReportService";
import { REPORT_PAGE_SIZE, dmy, scrollTop } from "../utils/reportUtils";

export default function SalesReportPage() {
  const { showSnackbar } = useSnackbar();

  const [filters, setFilters] = useState<DateRangeFilterValue>({});
  const [page, setPage] = useState(0);
  const [exporting, setExporting] = useState(false);

  const query = useSalesReport(filters);
  const data = query.data;

  const lastPage = Math.max(0, Math.ceil((data?.rows.length ?? 0) / REPORT_PAGE_SIZE) - 1);
  const safePage = Math.min(page, lastPage);

  const changeFilters = (next: DateRangeFilterValue) => {
    setFilters(next);
    setPage(0);
  };

  const changePage = (next: number) => {
    setPage(next);
    scrollTop();
  };

  const handleRefresh = async () => {
    setPage(0);
    await query.refetch();
  };

  const filterLines = [
    filters.startDate || filters.endDate
      ? `Dates: ${filters.startDate ? dmy(filters.startDate) : "start"} to ${filters.endDate ? dmy(filters.endDate) : "today"}`
      : "Dates: all time",
    filters.orderStatus ? `Order status: ${filters.orderStatus}` : "",
    filters.paymentStatus ? `Payment status: ${filters.paymentStatus.replace(/_/g, " ")}` : "",
    filters.search?.trim() ? `Search: ${filters.search.trim()}` : "",
  ].filter(Boolean);

  const handleExport = async (kind: "excel" | "pdf") => {
    if (!data || exporting) return;

    if (data.rows.length === 0) {
      showSnackbar("There is nothing to download for these filters.", "warning");
      return;
    }

    setExporting(true);

    try {
      const notice = data.truncated
        ? `INCOMPLETE REPORT: this date range has more than ${MAX_REPORT_ORDERS.toLocaleString("en-IN")} orders. Only the latest ${MAX_REPORT_ORDERS.toLocaleString("en-IN")} are included, so all totals are understated.`
        : undefined;

      if (kind === "excel") {
        const m = await import("../services/exportExcel");
        m.exportSalesReportToExcel(data.rows, data.summary, filterLines, notice);
      } else {
        const m = await import("../services/exportPdf");
        await m.exportSalesReportToPdf(data.rows, data.summary, filterLines, notice);
      }

      showSnackbar(
        data.truncated
          ? "Downloaded, but the report is incomplete. Use a shorter date range."
          : "Report downloaded.",
        data.truncated ? "warning" : "success",
      );
    } catch {
      showSnackbar("The download failed. Please try again.", "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Sales Report"
        subtitle="Revenue from orders that count as sales. Cancelled, returned and unpaid online orders are not counted."
        action={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => void handleRefresh()}
              disabled={query.isFetching}
            >
              {query.isFetching ? "Refreshing..." : "Refresh"}
            </Button>
            <ReportDownloadMenu
              onExcel={() => void handleExport("excel")}
              onPdf={() => void handleExport("pdf")}
              busy={exporting}
              disabled={!data}
            />
          </Stack>
        }
      />

      <SectionCard>
        <Stack spacing={2}>
          <DateRangeFilter value={filters} onChange={changeFilters} />

          {data?.truncated && (
            <Alert severity="warning">
              <strong>This report is incomplete.</strong> This date range has more than{" "}
              {MAX_REPORT_ORDERS.toLocaleString("en-IN")} orders, so only the latest{" "}
              {MAX_REPORT_ORDERS.toLocaleString("en-IN")} are included and the totals below
              are understated. Choose a shorter date range for complete figures.
            </Alert>
          )}

          {query.isLoading ? (
            <Stack spacing={1} aria-label="Loading sales report">
              <Stack direction="row" useFlexGap sx={{ gap: 1.5 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={72} sx={{ flex: 1 }} />
                ))}
              </Stack>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={44} />
              ))}
            </Stack>
          ) : query.isError || !data ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={() => void handleRefresh()}>
                  Try again
                </Button>
              }
            >
              Failed to load the sales report.
            </Alert>
          ) : (
            <>
              <ReportSummaryCards summary={data.summary} />

              {data.rows.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No orders match these filters.
                </Typography>
              ) : (
                <SalesReportTable rows={data.rows} page={safePage} onPageChange={changePage} />
              )}
            </>
          )}
        </Stack>
      </SectionCard>
    </PageContainer>
  );
}