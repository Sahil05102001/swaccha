import { downloadPdfReport } from "@/features/reports/utils/reportExport";
import { dmy, moneyPdf } from "@/features/reports/utils/reportUtils";

import {
  LOW_STOCK_AT,
  type InventoryReportRow,
  type InventoryReportSummary,
} from "./inventoryReportService";

export async function exportInventoryReportToPdf(
  rows: InventoryReportRow[],
  summary: InventoryReportSummary,
  filterLines: string[] = [],
) {
  await downloadPdfReport({
    fileName: "Inventory_Report",
    title: "Inventory Report",
    info: [
      `Generated on ${new Date().toLocaleString("en-IN")}`,
      `Filters: ${filterLines.length ? filterLines.join("   |   ") : "None"}`,
      `Low stock means ${LOW_STOCK_AT} or fewer units. ${rows.length} product${rows.length === 1 ? "" : "s"} listed.`,
    ],
    summary: [
      ["Products", String(summary.totalProducts)],
      ["Units in stock", String(summary.totalStockQuantity)],
      ["Stock value at cost", moneyPdf(summary.totalCostValue)],
      ["Stock value at selling price", moneyPdf(summary.totalRetailValue)],
      ["Low stock products", String(summary.lowStockProducts)],
      ["Out of stock products", String(summary.outOfStockProducts)],
    ],
    head: ["Product", "Category", "Cost", "Selling", "Stock", "Value at cost", "Value at selling", "Status", "Updated"],
    body: rows.map((r) => [
      r.sku ? `${r.productName}\n${r.sku}` : r.productName,
      r.category,
      r.purchasePrice > 0 ? moneyPdf(r.purchasePrice) : "-",
      moneyPdf(r.sellingPrice),
      String(r.stock),
      moneyPdf(r.costValue),
      moneyPdf(r.retailValue),
      r.stockStatus,
      dmy(r.lastUpdated),
    ]),
    rightAlign: [2, 3, 4, 5, 6],
  });
}