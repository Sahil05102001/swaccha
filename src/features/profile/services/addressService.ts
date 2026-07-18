import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import type { AddressFormData } from "../schemas/addressSchema";

function getAddressCollection() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated.");
  }

  return collection(
    db,
    "users",
    user.uid,
    "addresses"
  );
}

export async function getAddresses() {
  const snapshot = await getDocs(getAddressCollection());

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addAddress(
  address: AddressFormData
) {
  await addDoc(getAddressCollection(), {
    ...address,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateAddress(
  id: string,
  address: AddressFormData
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated.");
  }

  await updateDoc(
    doc(
      db,
      "users",
      user.uid,
      "addresses",
      id
    ),
    {
      ...address,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function deleteAddress(id: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated.");
  }

  await deleteDoc(
    doc(
      db,
      "users",
      user.uid,
      "addresses",
      id
    )
  );
}