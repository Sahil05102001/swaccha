import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
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

export async function addProduct(
  product: ProductFormData
) {
  await addDoc(productsCollection, {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(
  id: string,
  product: ProductFormData
) {
  await updateDoc(
    doc(db, "products", id),
    {
      ...product,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}