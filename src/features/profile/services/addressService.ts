import {
  collection,
  deleteField,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";


import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";


import type { Address } from "../types/address";


function getUserId() {
  const user = auth.currentUser;


  if (!user) {
    throw new Error("User is not authenticated.");
  }


  return user.uid;
}


function getAddressCollection() {
  return collection(db, "users", getUserId(), "addresses");
}


// Newest first, same order the list uses.
async function getAddressSnapshot() {
  const q = query(getAddressCollection(), orderBy("createdAt", "desc"));
  return getDocs(q);
}


export async function getAddresses() {
  const snapshot = await getAddressSnapshot();


  let defaultSeen = false;


  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data();


    // Safety net for old bad data: if several addresses are marked default,
    // only the newest one is shown as default. Saving or setting a default
    // later cleans the stored data too.
    const isDefault = Boolean(data.isDefault) && !defaultSeen;
    if (isDefault) defaultSeen = true;


    return {
      id: docSnapshot.id,
      ...data,
      isDefault,
    };
  }) as Address[];
}


export async function addAddress(
  address: Omit<Address, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const addressCollection = getAddressCollection();
  const snapshot = await getAddressSnapshot();


  // The first address is always the default.
  const isDefault = address.isDefault || snapshot.empty;


  const batch = writeBatch(db);


  // Clear the flag on every other address before saving the new default.
  if (isDefault) {
    snapshot.docs.forEach((document) => {
      if (document.data().isDefault) {
        batch.update(document.ref, {
          isDefault: false,
          updatedAt: serverTimestamp(),
        });
      }
    });
  }


  const newRef = doc(addressCollection);


  batch.set(newRef, {
    ...address,
    isDefault,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });


  await batch.commit();


  return newRef.id;
}


export async function updateAddress(id: string, address: Partial<Address>) {
  const userId = getUserId();
  const snapshot = await getAddressSnapshot();


  const current = snapshot.docs.find((document) => document.id === id);


  if (!current) {
    throw new Error("Address not found.");
  }


  const wasDefault = Boolean(current.data().isDefault);


  // Unticking "default" on the current default would leave no default at all.
  // To change the default, the user sets another address as default instead.
  const isDefault =
    address.isDefault === undefined
      ? wasDefault
      : address.isDefault || wasDefault;


  const batch = writeBatch(db);


  if (isDefault) {
    snapshot.docs.forEach((document) => {
      if (document.id !== id && document.data().isDefault) {
        batch.update(doc(db, "users", userId, "addresses", id), {
          ...address,
          // A hand-placed pin has no GPS accuracy, so remove any old value.
          ...(address.latitude !== undefined && address.locationAccuracy === undefined
            ? { locationAccuracy: deleteField() }
            : {}),
          isDefault,
          updatedAt: serverTimestamp(),
        });
      }
    });
  }


  batch.update(doc(db, "users", userId, "addresses", id), {
    ...address,
    isDefault,
    updatedAt: serverTimestamp(),
  });


  await batch.commit();
}


export async function deleteAddress(id: string) {
  const snapshot = await getAddressSnapshot();


  const target = snapshot.docs.find((document) => document.id === id);


  if (!target) return;


  const batch = writeBatch(db);


  batch.delete(target.ref);


  // If the default was deleted, the newest remaining address takes over.
  if (target.data().isDefault) {
    const next = snapshot.docs.find((document) => document.id !== id);


    if (next) {
      batch.update(next.ref, {
        isDefault: true,
        updatedAt: serverTimestamp(),
      });
    }
  }


  await batch.commit();
}


export async function setDefaultAddress(addressId: string) {
  const snapshot = await getAddressSnapshot();


  const batch = writeBatch(db);


  snapshot.docs.forEach((document) => {
    const shouldBeDefault = document.id === addressId;


    // Only write the documents that actually change.
    if (Boolean(document.data().isDefault) !== shouldBeDefault) {
      batch.update(document.ref, {
        isDefault: shouldBeDefault,
        updatedAt: serverTimestamp(),
      });
    }
  });


  await batch.commit();
}