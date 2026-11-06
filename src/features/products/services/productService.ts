import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type { ProductFormData } from "../schemas/productSchema";
import type { Product } from "../types/product";

const productsCollection = collection(db, "products");

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(productsCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Product, "id">),
  }));
}

/**
 * Fetches a single page of products from Firestore.
 * Pass the last document from the previous page as `lastDocument`.
 */
export async function getProductsPage(
  pageSize: number,
  lastDocument?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  products: Product[];
  lastDocument: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const constraints = [
    orderBy("__name__"),
    ...(lastDocument ? [startAfter(lastDocument)] : []),
    limit(pageSize + 1),
  ];

  const snapshot = await getDocs(
    query(productsCollection, ...constraints)
  );

  const hasMore = snapshot.docs.length > pageSize;
  const pageDocuments = snapshot.docs.slice(0, pageSize);

  return {
    products: pageDocuments.map((document) => ({
      id: document.id,
      ...(document.data() as Omit<Product, "id">),
    })),
    lastDocument:
      pageDocuments.length > 0
        ? pageDocuments[pageDocuments.length - 1]
        : null,
    hasMore,
  };
}

export async function getProduct(id: string): Promise<Product> {
  const snapshot = await getDoc(doc(db, "products", id));

  if (!snapshot.exists()) {
    throw new Error("Product not found.");
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Product, "id">),
  };
}

export async function addProduct(product: ProductFormData) {
  const created = await addDoc(productsCollection, {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return created.id;
}

export async function updateProduct(
  id: string,
  product: ProductFormData
) {
  // Stock is changed only from Stock History, so the ledger stays complete.
  const data: Record<string, unknown> = { ...product };
  delete data.stock;

  await updateDoc(doc(db, "products", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}

export async function updateProductFeatured(
  id: string,
  isFeatured: boolean
) {
  await updateDoc(doc(db, "products", id), {
    isFeatured,
    updatedAt: serverTimestamp(),
  });
}