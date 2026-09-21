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
  BestSeller,
  BestSellerFormData,
} from "../types/bestSeller";

const COLLECTION_NAME = "bestSellers";

const bestSellersCollection = collection(
  db,
  COLLECTION_NAME,
);

function mapBestSeller(document: any): BestSeller {
  const data = document.data();

  return {
    id: document.id,

    productId: data.productId ?? "",

    sortOrder: Number(data.sortOrder ?? 0),

    isActive: Boolean(data.isActive),

    createdAt:
      data.createdAt?.toDate?.() ?? new Date(),

    updatedAt:
      data.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function getBestSellers(): Promise<
  BestSeller[]
> {
  const bestSellerQuery = query(
    bestSellersCollection,
    orderBy("sortOrder", "asc"),
  );

  const snapshot = await getDocs(bestSellerQuery);

  return snapshot.docs.map(mapBestSeller);
}

export async function createBestSeller(
  data: BestSellerFormData,
): Promise<void> {
  const now = new Date();

  await addDoc(bestSellersCollection, {
    ...data,

    createdAt: now,

    updatedAt: now,
  });
}

export async function updateBestSeller(
  id: string,
  data: BestSellerFormData,
): Promise<void> {
  await updateDoc(
    doc(db, COLLECTION_NAME, id),
    {
      ...data,

      updatedAt: new Date(),
    },
  );
}

export async function deleteBestSeller(
  id: string,
): Promise<void> {
  await deleteDoc(
    doc(db, COLLECTION_NAME, id),
  );
}