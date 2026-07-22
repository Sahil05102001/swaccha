import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type {
  Category,
  CategoryFormData,
} from "../types/category";

const categoriesCollection = collection(
  db,
  "categories"
);

export async function getCategories(
  activeOnly = false
): Promise<Category[]> {
  const categoriesQuery = activeOnly
    ? query(
        categoriesCollection,
        where("isActive", "==", true)
      )
    : categoriesCollection;

  const snapshot = await getDocs(
    categoriesQuery
  );

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Category, "id">),
  }));
}

export async function createCategory(
  category: CategoryFormData
) {
  await addDoc(categoriesCollection, {
    name: category.name,
    imageUrl: category.imageUrl,
    isActive: category.isActive,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCategory(
  id: string,
  category: CategoryFormData
) {
  await updateDoc(doc(db, "categories", id), {
    name: category.name,
    imageUrl: category.imageUrl,
    isActive: category.isActive,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, "categories", id));
}