import { downloadExcelReport } from "../utils/reportExport";
import { dmy } from "../utils/reportUtils";

import type {
  SalesReportRow,
  SalesReportSummary,
} from "./salesReportService";

export function exportSalesReportToExcel(
  rows: SalesReportRow[],
  summary: SalesReportSummary,
  filterLines: string[] = [],
  notice?: string,
) {
  downloadExcelReport({
    notice,
    fileName: "Sales_Report",
    title: "Sales Report",
    info: [
      ["Generated on", new Date().toLocaleString("en-IN")],
      ["Filters", filterLines.length ? filterLines.join("   |   ") : "None"],
      ["Orders listed", rows.length],
    ],
    summary: [
      ["Net revenue (after refunds)", summary.netRevenue, "money"],
      ["Orders counted as sales", summary.totalOrders, "int"],
      ["Units sold", summary.totalProductsSold, "int"],
      ["Average order value", summary.averageOrderValue, "money"],
      ["GST included in revenue", summary.gstIncluded, "money"],
      ["Partial refunds", summary.refundedAmount, "money"],
      ["Cancelled / returned orders", summary.cancelledOrders, "int"],
    ],
    columns: [
      { header: "Order No.", width: 18 },
      { header: "Customer", width: 26 },
      { header: "Email", width: 32 },
      { header: "Date", width: 12 },
      { header: "Order status", width: 14 },
      { header: "Payment status", width: 18 },
      { header: "Payment method", width: 16 },
      { header: "Units", width: 8, type: "int" },
      { header: "Order total", width: 15, type: "money" },
      { header: "Refunded", width: 14, type: "money" },
      { header: "Net sales", width: 15, type: "money" },
      { header: "GST included", width: 15, type: "money" },
    ],
    rows: rows.map((r) => [
      r.orderId,
      r.customerName,
      r.customerEmail,
      dmy(r.orderDate),
      r.orderStatus,
      r.paymentStatus.replace(/_/g, " "),
      r.paymentMethod.toUpperCase(),
      r.productsSold,
      r.totalAmount,
      r.refundedAmount,
      r.netAmount,
      r.gstAmount,
    ]),
  });
}