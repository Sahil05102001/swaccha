import { downloadExcelReport } from "@/features/reports/utils/reportExport";
import { dmy } from "@/features/reports/utils/reportUtils";

import {
  LOW_STOCK_AT,
  type InventoryReportRow,
  type InventoryReportSummary,
} from "./inventoryReportService";

export function exportInventoryReportToExcel(
  rows: InventoryReportRow[],
  summary: InventoryReportSummary,
  filterLines: string[] = [],
) {
  downloadExcelReport({
    fileName: "Inventory_Report",
    title: "Inventory Report",
    info: [
      ["Generated on", new Date().toLocaleString("en-IN")],
      ["Filters", filterLines.length ? filterLines.join("   |   ") : "None"],
      ["Low stock means", `${LOW_STOCK_AT} or fewer units`],
    ],
    summary: [
      ["Products", summary.totalProducts, "int"],
      ["Units in stock", summary.totalStockQuantity, "int"],
      ["Stock value at cost", summary.totalCostValue, "money"],
      ["Stock value at selling price", summary.totalRetailValue, "money"],
      ["Low stock products", summary.lowStockProducts, "int"],
      ["Out of stock products", summary.outOfStockProducts, "int"],
      ["In-stock products without a purchase price", summary.missingCostProducts, "int"],
    ],
    columns: [
      { header: "Product", width: 32 },
      { header: "SKU", width: 16 },
      { header: "Category", width: 20 },
      { header: "Cost price", width: 14, type: "money" },
      { header: "Selling price", width: 14, type: "money" },
      { header: "Stock", width: 8, type: "int" },
      { header: "Value at cost", width: 16, type: "money" },
      { header: "Value at selling price", width: 18, type: "money" },
      { header: "Status", width: 14 },
      { header: "Last updated", width: 14 },
    ],
    rows: rows.map((r) => [
      r.productName,
      r.sku,
      r.category,
      r.purchasePrice,
      r.sellingPrice,
      r.stock,
      r.costValue,
      r.retailValue,
      r.stockStatus,
      dmy(r.lastUpdated),
    ]),
  });
}