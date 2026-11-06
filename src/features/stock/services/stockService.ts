import {
  collection,
  getAggregateFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  sum,
  Timestamp,
  where,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const STOCK_PAGE_SIZE = 10;

export type MovementType =
  | "initial"
  | "received"
  | "sale"
  | "manualAdd"
  | "manualDeduct"
  | "return"
  | "adjustment";

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  movementType: MovementType;
  direction: "in" | "out";
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  note?: string;
  createdBy?: string;
  createdAt: Timestamp;
}

export interface StockFilters {
  productId: string;
  movementType: string;
  from: string; // YYYY-MM-DD or ""
  to: string;
}

export interface StockPage {
  movements: StockMovement[];
  last: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

function baseConstraints(f: StockFilters, withType: boolean): QueryConstraint[] {
  const c: QueryConstraint[] = [];
  if (f.productId) c.push(where("productId", "==", f.productId));
  if (withType && f.movementType) c.push(where("movementType", "==", f.movementType));
  if (f.from) c.push(where("createdAt", ">=", Timestamp.fromDate(new Date(`${f.from}T00:00:00`))));
  if (f.to) c.push(where("createdAt", "<=", Timestamp.fromDate(new Date(`${f.to}T23:59:59.999`))));
  return c;
}

export async function fetchStockPage(
  filters: StockFilters,
  after: QueryDocumentSnapshot | null,
): Promise<StockPage> {
  const snap = await getDocs(
    query(
      collection(db, "stockMovements"),
      ...baseConstraints(filters, true),
      orderBy("createdAt", "desc"),
      ...(after ? [startAfter(after)] : []),
      limit(STOCK_PAGE_SIZE + 1),
    ),
  );

  const docs = snap.docs.slice(0, STOCK_PAGE_SIZE);

  return {
    movements: docs.map((d) => ({ id: d.id, ...d.data() }) as StockMovement),
    last: docs[docs.length - 1] ?? null,
    hasMore: snap.docs.length > STOCK_PAGE_SIZE,
  };
}

/** One sum query for the period. It ignores the movement-type filter. */
export async function fetchStockSummary(filters: StockFilters) {
  const result = await getAggregateFromServer(
    query(collection(db, "stockMovements"), ...baseConstraints(filters, false)),
    {
      received: sum("qtyReceived"),
      sold: sum("qtySold"),
      restored: sum("qtyRestored"),
      manualIn: sum("qtyManualIn"),
      manualOut: sum("qtyManualOut"),
    },
  );

  return result.data();
}

async function post<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to continue.");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await user.getIdToken()}`,
    },
    body: JSON.stringify(body ?? {}),
  });

  const result = (await response.json().catch(() => null)) as
    | (T & { message?: string })
    | null;

  if (!response.ok || !result) {
    throw new Error(result?.message ?? "The request could not be completed.");
  }

  return result;
}

export const adjustStockRequest = (input: {
  productId: string;
  action: string;
  quantity: number;
  reference?: string;
  note?: string;
}) => post<{ message: string }>("/admin/stock/adjust", input);

export const recordInitialStockRequest = (productId: string) =>
  post<{ recorded: boolean }>(`/admin/stock/initial/${encodeURIComponent(productId)}`);