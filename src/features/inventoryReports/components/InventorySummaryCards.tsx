import { Stack } from "@mui/material";

import ReportStat from "@/features/reports/components/ReportStat";
import { money } from "@/features/reports/utils/reportUtils";

import {
  LOW_STOCK_AT,
  type InventoryReportSummary,
} from "../services/inventoryReportService";

export default function InventorySummaryCards({
  summary,
}: {
  summary: InventoryReportSummary;
}) {
  return (
    <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1.5 }}>
      <ReportStat label="Products" value={summary.totalProducts} />
      <ReportStat label="Units in stock" value={summary.totalStockQuantity} />
      <ReportStat
        label="Stock value at cost"
        value={money(summary.totalCostValue)}
        hint={
          summary.missingCostProducts > 0
            ? `${summary.missingCostProducts} in-stock product${summary.missingCostProducts === 1 ? " has" : "s have"} no purchase price`
            : "At purchase price"
        }
      />
      <ReportStat
        label="Stock value at selling price"
        value={money(summary.totalRetailValue)}
        hint="If all stock sold at full price"
      />
      <ReportStat
        label="Low stock"
        value={summary.lowStockProducts}
        hint={`${LOW_STOCK_AT} or fewer left`}
      />
      <ReportStat label="Out of stock" value={summary.outOfStockProducts} />
    </Stack>
  );
}