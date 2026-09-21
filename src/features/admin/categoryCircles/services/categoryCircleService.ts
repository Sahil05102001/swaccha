import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type {
  CategoryCircle,
  CategoryCircleFormData,
} from "../types/categoryCircle";

const COLLECTION_NAME = "categoryCircles";

const categoryCirclesCollection = collection(
  db,
  COLLECTION_NAME,
);

function mapCategoryCircle(
  document: any,
): CategoryCircle {
  const data = document.data();

  return {
    id: document.id,

    label: data.label ?? "",

    imageUrl: data.imageUrl ?? "",

    icon: data.icon ?? "Category",

    href: data.href ?? "/products",

    sortOrder: Number(data.sortOrder ?? 0),

    isActive: Boolean(data.isActive),

    createdAt:
      data.createdAt?.toDate?.() ?? new Date(),

    updatedAt:
      data.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function getCategoryCircles(): Promise<
  CategoryCircle[]
> {
  const categoryQuery = query(
    categoryCirclesCollection,
    orderBy("sortOrder", "asc"),
  );

  const snapshot = await getDocs(categoryQuery);

  return snapshot.docs.map(mapCategoryCircle);
}

export async function createCategoryCircle(
  data: CategoryCircleFormData,
): Promise<void> {
  const now = new Date();

  await addDoc(categoryCirclesCollection, {
    ...data,
    imageUrl: data.imageUrl ?? "",
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateCategoryCircle(
  id: string,
  data: CategoryCircleFormData,
): Promise<void> {
  await updateDoc(
    doc(db, COLLECTION_NAME, id),
    {
      ...data,
      imageUrl: data.imageUrl ?? "",
      updatedAt: new Date(),
    },
  );
}

export async function deleteCategoryCircle(
  id: string,
): Promise<void> {
  await deleteDoc(
    doc(db, COLLECTION_NAME, id),
  );
}