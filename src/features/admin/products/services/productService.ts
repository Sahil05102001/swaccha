import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";
import type { Product, ProductFormData } from "../types/product";

const productsCollection = collection(db, "products");

export interface ProductsPageResult {
  products: Product[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

/**
 * Fetch active products using Firestore cursor pagination.
 *
 * Pass the previous page's lastVisible cursor to load the next page.
 * Fetches one extra document to determine whether another page exists.
 */
export async function getProductsPage(
  pageSize: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | null = null,
): Promise<ProductsPageResult> {
  const constraints = [
    where("isActive", "==", true),
    orderBy("createdAt", "desc"),
    ...(lastVisible ? [startAfter(lastVisible)] : []),
    limit(pageSize + 1),
  ];

  const productsQuery = query(productsCollection, ...constraints);
  const snapshot = await getDocs(productsQuery);

  const hasMore = snapshot.docs.length > pageSize;
  const pageDocs = snapshot.docs.slice(0, pageSize);

  const products: Product[] = pageDocs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Product, "id">),
  }));

  return {
    products,
    lastVisible: pageDocs.length
      ? pageDocs[pageDocs.length - 1]
      : null,
    hasMore,
  };
}

/**
 * Existing unpaginated function retained for other parts of the app.
 * The storefront will use getProductsPage instead.
 */
export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(productsCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Product, "id">),
  }));
}

export async function createProduct(product: ProductFormData) {
  const created = await addDoc(productsCollection, {
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    stock: product.stock,
    images: product.images,
    isActive: product.isActive,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return created.id;
}

export async function updateProduct(
  id: string,
  product: ProductFormData,
) {
  await updateDoc(doc(db, "products", id), {
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    images: product.images,
    isActive: product.isActive,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}