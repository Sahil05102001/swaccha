import { Timestamp, collection, getDocs } from "firebase/firestore";

import { db } from "@/firebase/firestore";

/** Same limit as the dashboard's Inventory Alerts. */
export const LOW_STOCK_AT = 5;

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export const STOCK_STATUSES: StockStatus[] = ["In Stock", "Low Stock", "Out of Stock"];

export interface InventoryReportFilters {
  search?: string;
  category?: string;
  stockStatus?: string;
}

export interface InventoryReportRow {
  id: string;
  productName: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  /** stock x purchase price */
  costValue: number;
  /** stock x selling price */
  retailValue: number;
  stockStatus: StockStatus;
  lastUpdated: Date | null;
}

export interface InventoryReportSummary {
  totalProducts: number;
  totalStockQuantity: number;
  totalCostValue: number;
  totalRetailValue: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  /** In-stock products with no purchase price saved (cost value is understated). */
  missingCostProducts: number;
}

export interface InventoryReport {
  summary: InventoryReportSummary;
  rows: InventoryReportRow[];
  categories: string[];
}

const num = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const round2 = (value: number) => Math.round(value * 100) / 100;

/** One download of all products. Filters run on screen. */
export async function fetchInventoryRows(): Promise<InventoryReportRow[]> {
  const snapshot = await getDocs(collection(db, "products"));

  const rows = snapshot.docs.map((d): InventoryReportRow => {
    const p = d.data();

    const stock = typeof p.stock === "number" ? p.stock : num(p.quantity);
    const purchasePrice = num(p.purchasePrice);
    const sellingPrice = typeof p.price === "number" ? p.price : num(p.sellingPrice);

    const stockStatus: StockStatus =
      stock <= 0 ? "Out of Stock" : stock <= LOW_STOCK_AT ? "Low Stock" : "In Stock";

    const units = Math.max(stock, 0);

    return {
      id: d.id,
      productName: String(p.name ?? p.title ?? "Unnamed product"),
      sku: String(p.sku ?? ""),
      category: String(p.category ?? "") || "Uncategorized",
      purchasePrice,
      sellingPrice,
      stock,
      costValue: round2(units * purchasePrice),
      retailValue: round2(units * sellingPrice),
      stockStatus,
      lastUpdated: p.updatedAt instanceof Timestamp ? p.updatedAt.toDate() : null,
    };
  });

  // Lowest stock first, so the products that need attention are on top.
  rows.sort((a, b) =>
    a.stock !== b.stock ? a.stock - b.stock : a.productName.localeCompare(b.productName),
  );

  return rows;
}

export function buildInventoryReport(
  all: InventoryReportRow[],
  filters: InventoryReportFilters,
): InventoryReport {
  const search = filters.search?.trim().toLowerCase() ?? "";

  const rows = all.filter((row) => {
    if (filters.category && row.category !== filters.category) return false;
    if (filters.stockStatus && row.stockStatus !== filters.stockStatus) return false;

    if (
      search &&
      ![row.productName, row.sku, row.category].join(" ").toLowerCase().includes(search)
    ) {
      return false;
    }

    return true;
  });

  const summary: InventoryReportSummary = {
    totalProducts: rows.length,
    totalStockQuantity: 0,
    totalCostValue: 0,
    totalRetailValue: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    missingCostProducts: 0,
  };

  for (const row of rows) {
    summary.totalStockQuantity += Math.max(row.stock, 0);
    summary.totalCostValue += row.costValue;
    summary.totalRetailValue += row.retailValue;

    if (row.stockStatus === "Low Stock") summary.lowStockProducts++;
    if (row.stockStatus === "Out of Stock") summary.outOfStockProducts++;
    if (row.stock > 0 && row.purchasePrice <= 0) summary.missingCostProducts++;
  }

  summary.totalCostValue = round2(summary.totalCostValue);
  summary.totalRetailValue = round2(summary.totalRetailValue);

  // From ALL products, so the dropdown keeps every category after one is chosen.
  const categories = Array.from(new Set(all.map((row) => row.category).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b),
  );

  return { summary, rows, categories };
}