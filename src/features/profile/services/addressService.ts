import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import type { Address } from "../types/address";

function getAddressCollection() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  return collection(db, "users", user.uid, "addresses");
}

export async function getAddresses() {
  const addressCollection = getAddressCollection();

  const q = query(
    addressCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  })) as Address[];
}

export async function addAddress(
  address: Omit<
    Address,
    "id" | "createdAt" | "updatedAt"
  >
) {
  const addressCollection = getAddressCollection();

  await addDoc(addressCollection, {
    ...address,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateAddress(
  id: string,
  address: Partial<Address>
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const addressRef = doc(
    db,
    "users",
    user.uid,
    "addresses",
    id
  );

  await updateDoc(addressRef, {
    ...address,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAddress(id: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const addressRef = doc(
    db,
    "users",
    user.uid,
    "addresses",
    id
  );

  await deleteDoc(addressRef);
}

export async function setDefaultAddress(addressId: string) {
  const addressCollection = getAddressCollection();

  const snapshot = await getDocs(addressCollection);

  const batch = writeBatch(db);

  snapshot.forEach((document) => {
    batch.update(document.ref, {
      isDefault: document.id === addressId,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}