import {
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";
import { isUnpaidRazorpayOrder } from "@/features/orders/services/orderService";
import type { Order } from "@/features/orders/types/order";

/** Safety limit for one report, so a huge range can't freeze the browser. */
export const MAX_REPORT_ORDERS = 2000;

/** One extra order is requested, so "there are more" can be detected. */
export const REPORT_FETCH_LIMIT = MAX_REPORT_ORDERS + 1;

/** Keeps the first `max` items and says whether any were left out. */
export function applyOrderLimit<T>(items: T[], max = MAX_REPORT_ORDERS) {
  return { items: items.slice(0, max), truncated: items.length > max };
}

const NOT_SALES = new Set(["cancelled", "returned"]);

export interface SalesDateRange {
  startDate?: Date;
  endDate?: Date;
}

export interface SalesReportFilters extends SalesDateRange {
  search?: string;
  orderStatus?: string;
  paymentStatus?: string;
}

export interface SalesReportRow {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderDate: Date | null;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  productsSold: number;
  /** What the customer was charged. */
  totalAmount: number;
  /** Refunded so far (failed refunds are ignored). */
  refundedAmount: number;
  /** What counts as sales: 0 for cancelled and returned orders. */
  netAmount: number;
  /** GST included in netAmount. */
  gstAmount: number;
  countsAsSale: boolean;
}

export interface SalesReportSummary {
  netRevenue: number;
  totalOrders: number;
  totalProductsSold: number;
  averageOrderValue: number;
  gstIncluded: number;
  refundedAmount: number;
  cancelledOrders: number;
}

export interface SalesReportRaw {
  rows: SalesReportRow[];
  truncated: boolean;
}

export interface SalesReport {
  summary: SalesReportSummary;
  rows: SalesReportRow[];
  truncated: boolean;
}

const paise = (value: unknown) =>
  Math.round((typeof value === "number" ? value : 0) * 100);

function toRow(id: string, data: DocumentData): SalesReportRow | null {
  const order = { id, ...data } as Order;

  if (isUnpaidRazorpayOrder(order)) return null;

  const orderStatus = String(order.orderStatus ?? "unknown");
  const countsAsSale = !NOT_SALES.has(orderStatus.toLowerCase());

  const totalPaise = paise(order.totalAmount);
  const refunds = (order.refunds ?? []).filter((r) => r.status !== "failed");
  const refundedPaise = refunds.reduce((t, r) => t + paise(r.amount), 0);

  const netPaise = countsAsSale ? Math.max(0, totalPaise - refundedPaise) : 0;

  let gstPaise = 0;
  const tax = order.tax;
  if (countsAsSale && tax?.applied === true) {
    const credited = refunds.reduce(
      (t, r) =>
        t +
        (r.creditNote
          ? r.creditNote.cgstPaise + r.creditNote.sgstPaise + r.creditNote.igstPaise
          : 0),
      0,
    );
    gstPaise = Math.max(0, tax.totalTaxPaise - credited);
  }

  const productsSold = Array.isArray(order.items)
    ? order.items.reduce(
      (total, item) =>
        total + (typeof item.quantity === "number" ? item.quantity : 0),
      0,
    )
    : 0;

  return {
    id,
    orderId: order.orderNumber ?? id,
    customerName:
      order.customerName || order.shippingAddress?.fullName || "Unknown customer",
    customerEmail: order.customerEmail ?? "",
    orderDate: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
    orderStatus,
    paymentStatus: String(order.paymentStatus ?? "unknown"),
    paymentMethod: String(order.paymentMethod ?? ""),
    productsSold,
    totalAmount: totalPaise / 100,
    refundedAmount: refundedPaise / 100,
    netAmount: netPaise / 100,
    gstAmount: gstPaise / 100,
    countsAsSale,
  };
}

/** One download per date range. Everything else is filtered on screen. */
export async function fetchSalesReportRows(
  range: SalesDateRange,
): Promise<SalesReportRaw> {
  const constraints: QueryConstraint[] = [];

  if (range.startDate) {
    constraints.push(where("createdAt", ">=", Timestamp.fromDate(range.startDate)));
  }
  if (range.endDate) {
    constraints.push(where("createdAt", "<=", Timestamp.fromDate(range.endDate)));
  }

  constraints.push(orderBy("createdAt", "desc"), limit(REPORT_FETCH_LIMIT));

  const snap = await getDocs(query(collection(db, "orders"), ...constraints));

  const { items: docs, truncated } = applyOrderLimit(snap.docs);

  const rows = docs
    .map((d) => toRow(d.id, d.data()))
    .filter((row): row is SalesReportRow => row !== null);

  return { rows, truncated };
}

export function buildSalesReport(
  raw: SalesReportRaw,
  filters: SalesReportFilters,
): SalesReport {
  const search = filters.search?.trim().toLowerCase() ?? "";

  const rows = raw.rows.filter((row) => {
    if (
      filters.orderStatus &&
      row.orderStatus.toLowerCase() !== filters.orderStatus.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.paymentStatus &&
      row.paymentStatus.toLowerCase() !== filters.paymentStatus.toLowerCase()
    ) {
      return false;
    }

    if (
      search &&
      ![row.orderId, row.customerName, row.customerEmail]
        .join(" ")
        .toLowerCase()
        .includes(search)
    ) {
      return false;
    }

    return true;
  });

  let netPaise = 0;
  let gstPaise = 0;
  let refundedPaise = 0;
  let orders = 0;
  let units = 0;
  let cancelled = 0;

  for (const row of rows) {
    if (row.countsAsSale) {
      orders++;
      units += row.productsSold;
      netPaise += Math.round(row.netAmount * 100);
      gstPaise += Math.round(row.gstAmount * 100);
      refundedPaise += Math.round(row.refundedAmount * 100);
    } else {
      cancelled++;
    }
  }

  return {
    rows,
    truncated: raw.truncated,
    summary: {
      netRevenue: netPaise / 100,
      totalOrders: orders,
      totalProductsSold: units,
      averageOrderValue: orders > 0 ? Math.round(netPaise / orders) / 100 : 0,
      gstIncluded: gstPaise / 100,
      refundedAmount: refundedPaise / 100,
      cancelledOrders: cancelled,
    },
  };
}