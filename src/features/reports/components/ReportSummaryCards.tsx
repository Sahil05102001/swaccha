import { Stack } from "@mui/material";

import type { SalesReportSummary } from "../services/salesReportService";
import { money } from "../utils/reportUtils";

import ReportStat from "./ReportStat";

export default function ReportSummaryCards({ summary }: { summary: SalesReportSummary }) {
  return (
    <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1.5 }}>
      <ReportStat label="Net revenue" value={money(summary.netRevenue)} hint="After refunds" />
      <ReportStat label="Orders" value={summary.totalOrders} hint="Counted as sales" />
      <ReportStat label="Units sold" value={summary.totalProductsSold} />
      <ReportStat label="Average order" value={money(summary.averageOrderValue)} />
      <ReportStat label="GST included" value={money(summary.gstIncluded)} hint="Part of net revenue" />
      <ReportStat label="Partial refunds" value={money(summary.refundedAmount)} />
      <ReportStat label="Cancelled / returned" value={summary.cancelledOrders} hint="Not in revenue" />
    </Stack>
  );
}