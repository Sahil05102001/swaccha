import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type {
  Product,
  ProductFormData,
} from "../types/product";

const productsCollection = collection(
  db,
  "products"
);

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(
    productsCollection
  );

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Product, "id">),
  }));
}

export async function createProduct(
  product: ProductFormData
) {
  await addDoc(productsCollection, {
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
}

export async function updateProduct(
  id: string,
  product: ProductFormData
) {
  await updateDoc(doc(db, "products", id), {
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    stock: product.stock,
    images: product.images,
    isActive: product.isActive,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}