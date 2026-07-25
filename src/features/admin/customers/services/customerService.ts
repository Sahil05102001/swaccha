import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
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

export async function getCustomers(): Promise<Customer[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "users"),
      orderBy("createdAt", "desc")
    )
  );

  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Customer),
    uid: doc.id,
  }));
}

export async function getCustomerById(
  uid: string
): Promise<Customer> {
  const snapshot = await getDoc(
    doc(db, "users", uid)
  );

  if (!snapshot.exists()) {
    throw new Error("Customer not found.");
  }

  return {
    ...(snapshot.data() as Customer),
    uid: snapshot.id,
  };
}