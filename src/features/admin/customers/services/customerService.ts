import {
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export interface Customer {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  isActive: boolean;
  createdAt?: {
    toDate(): Date;
  };
}

export const CUSTOMERS_PAGE_SIZE = 10;

export interface CustomersPage {
  customers: Customer[];
  last: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

/** One page of customers, newest first, or an email-prefix search. */
export async function getCustomersPage(
  after: QueryDocumentSnapshot | null,
  emailPrefix: string,
): Promise<CustomersPage> {
  const prefix = emailPrefix.trim().toLowerCase();

  const constraints: QueryConstraint[] = prefix
    ? [
        orderBy("email"),
        after ? startAfter(after) : startAt(prefix),
        endAt(`${prefix}\uf8ff`),
      ]
    : [orderBy("createdAt", "desc"), ...(after ? [startAfter(after)] : [])];

  const snap = await getDocs(
    query(
      collection(db, "users"),
      ...constraints,
      limit(CUSTOMERS_PAGE_SIZE + 1),
    ),
  );

  const docs = snap.docs.slice(0, CUSTOMERS_PAGE_SIZE);

  return {
    customers: docs.map((d) => ({ ...(d.data() as Customer), uid: d.id })),
    last: docs[docs.length - 1] ?? null,
    hasMore: snap.docs.length > CUSTOMERS_PAGE_SIZE,
  };
}

export async function getCustomers(): Promise<Customer[]> {
  const snapshot = await getDocs(
    query(collection(db, "users"), orderBy("createdAt", "desc")),
  );

  return snapshot.docs.map((d) => ({
    ...(d.data() as Customer),
    uid: d.id,
  }));
}

export async function getCustomerById(uid: string): Promise<Customer> {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    throw new Error("Customer not found.");
  }

  return {
    ...(snapshot.data() as Customer),
    uid: snapshot.id,
  };
}