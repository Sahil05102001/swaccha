import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type { Coupon } from "@/features/coupons/types/coupons";

const collectionRef = collection(
  db,
  "coupons",
);

export async function getCoupons() {
  const snapshot =
    await getDocs(collectionRef);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as Coupon[];
}

export async function createCoupon(
  coupon: Omit<Coupon, "id">,
) {
  await addDoc(collectionRef, coupon);
}

export async function updateCoupon(
  id: string,
  coupon: Partial<Coupon>,
) {
  await updateDoc(
    doc(db, "coupons", id),
    coupon,
  );
}

export async function deleteCoupon(
  id: string,
) {
  await deleteDoc(
    doc(db, "coupons", id),
  );
}