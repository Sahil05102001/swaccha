import { downloadPdfReport } from "../utils/reportExport";
import { dmy, moneyPdf } from "../utils/reportUtils";

import type {
  SalesReportRow,
  SalesReportSummary,
} from "./salesReportService";

export async function exportSalesReportToPdf(
  rows: SalesReportRow[],
  summary: SalesReportSummary,
  filterLines: string[] = [],
  notice?: string,
) {
  await downloadPdfReport({
    notice,
    fileName: "Sales_Report",
    title: "Sales Report",
    info: [
      `Generated on ${new Date().toLocaleString("en-IN")}`,
      `Filters: ${filterLines.length ? filterLines.join("   |   ") : "None"}`,
      `${rows.length} order${rows.length === 1 ? "" : "s"} listed`,
    ],
    summary: [
      ["Net revenue (after refunds)", moneyPdf(summary.netRevenue)],
      ["Orders counted as sales", String(summary.totalOrders)],
      ["Units sold", String(summary.totalProductsSold)],
      ["Average order value", moneyPdf(summary.averageOrderValue)],
      ["GST included in revenue", moneyPdf(summary.gstIncluded)],
      ["Partial refunds", moneyPdf(summary.refundedAmount)],
      ["Cancelled / returned orders", String(summary.cancelledOrders)],
    ],
    head: ["Order", "Customer", "Date", "Status", "Payment", "Units", "Total", "Refunded", "Net", "GST"],
    body: rows.map((r) => [
      r.orderId,
      r.customerName,
      dmy(r.orderDate),
      r.orderStatus,
      `${r.paymentStatus.replace(/_/g, " ")}\n${r.paymentMethod.toUpperCase()}`,
      String(r.productsSold),
      moneyPdf(r.totalAmount),
      r.refundedAmount > 0 ? moneyPdf(r.refundedAmount) : "-",
      r.countsAsSale ? moneyPdf(r.netAmount) : "Not counted",
      r.gstAmount > 0 ? moneyPdf(r.gstAmount) : "-",
    ]),
    rightAlign: [5, 6, 7, 8, 9],
  });
}