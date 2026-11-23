import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  MAX_REPORT_ORDERS,
  REPORT_FETCH_LIMIT,
  applyOrderLimit,
  buildSalesReport,
  fetchSalesReportRows,
} from "./salesReportService";

// How many orders the pretend collection holds, and how many are unpaid online orders.
const fake = vi.hoisted(() => ({
  total: 0,
  unpaid: 0,
  lastLimit: null as number | null,
}));

vi.mock("firebase/firestore", () => {
  class Timestamp {
    private date: Date;
    constructor(date: Date) {
      this.date = date;
    }
    toDate() {
      return this.date;
    }
    static fromDate(date: Date) {
      return new Timestamp(date);
    }
  }

  type Constraint = { kind: string; n?: number };

  return {
    Timestamp,
    collection: () => ({}),
    where: () => ({ kind: "where" }),
    orderBy: () => ({ kind: "orderBy" }),
    limit: (n: number) => ({ kind: "limit", n }),
    query: (_source: unknown, ...constraints: Constraint[]) => ({ constraints }),
    // Like Firestore: never returns more documents than the query's limit.
    getDocs: async (q: { constraints: Constraint[] }) => {
      const limitValue = q.constraints.find((c) => c.kind === "limit")?.n;
      if (limitValue === undefined) {
        throw new Error("The query has no limit, so it would read every order.");
      }
      fake.lastLimit = limitValue;

      const count = Math.min(fake.total, limitValue);

      return {
        docs: Array.from({ length: count }, (_, i) => {
          const unpaid = i < fake.unpaid;
          return {
            id: `order-${i}`,
            data: () => ({
              orderNumber: `SW-${i}`,
              createdAt: new Timestamp(new Date(2026, 10, 1)),
              orderStatus: "delivered",
              paymentMethod: unpaid ? "razorpay" : "cod",
              paymentStatus: unpaid ? "pending" : "paid",
              totalAmount: 100,
              items: [{ quantity: 1 }],
              customerName: "Test",
              customerEmail: "test@example.com",
            }),
          };
        }),
      };
    },
  };
});

vi.mock("@/firebase/firestore", () => ({ db: {} }));

vi.mock("@/features/orders/services/orderService", () => ({
  isUnpaidRazorpayOrder: (order: { paymentMethod?: string; paymentStatus?: string }) =>
    order.paymentMethod === "razorpay" && order.paymentStatus === "pending",
}));

beforeEach(() => {
  fake.total = 0;
  fake.unpaid = 0;
  fake.lastLimit = null;
});

describe("sales report order limit", () => {
  it("asks for one more order than it keeps", () => {
    expect(MAX_REPORT_ORDERS).toBe(2000);
    expect(REPORT_FETCH_LIMIT).toBe(2001);
  });

  it.each([
    [0, 0, false],
    [1999, 1999, false],
    [2000, 2000, false],
    [2001, 2000, true],
    [5000, 2000, true],
  ])("applyOrderLimit with %i items keeps %i, truncated=%s", (count, kept, truncated) => {
    const result = applyOrderLimit(Array.from({ length: count }));
    expect(result.items).toHaveLength(kept);
    expect(result.truncated).toBe(truncated);
  });

  it.each([
    // total orders, unpaid among them, rows shown, truncated
    [0, 0, 0, false],
    [1999, 0, 1999, false],
    [2000, 0, 2000, false], // exactly at the limit: no warning
    [2001, 0, 2000, true], // one over: warning
    [5000, 0, 2000, true],
    [2001, 100, 1900, true], // unpaid online orders count toward the cap but are hidden
  ])(
    "%i orders (%i unpaid) gives %i rows, truncated=%s",
    async (total, unpaid, rows, truncated) => {
      fake.total = total;
      fake.unpaid = unpaid;

      const result = await fetchSalesReportRows({});

      expect(fake.lastLimit).toBe(REPORT_FETCH_LIMIT);
      expect(result.rows).toHaveLength(rows);
      expect(result.truncated).toBe(truncated);
    },
  );

  it("keeps the warning flag when filtering on screen", async () => {
    fake.total = 5000;
    const raw = await fetchSalesReportRows({});

    expect(buildSalesReport(raw, {}).truncated).toBe(true);
    expect(buildSalesReport(raw, { orderStatus: "cancelled" }).truncated).toBe(true);
    expect(buildSalesReport(raw, { search: "no-such-order" }).truncated).toBe(true);
  });

  it("totals cover only the loaded orders, which is why the warning is needed", async () => {
    fake.total = 5000;
    const report = buildSalesReport(await fetchSalesReportRows({}), {});

    expect(report.summary.totalOrders).toBe(2000);
    expect(report.summary.netRevenue).toBe(200000);
  });
});