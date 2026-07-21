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

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import type { CartItem } from "../types/cart";

function getCartCollection() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User is not authenticated.");
    }

    return collection(db, "users", user.uid, "cart");
}

export async function getCartItems(): Promise<CartItem[]> {
    const snapshot = await getDocs(getCartCollection());

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as CartItem[];
}

export async function addCartItem(
    item: Omit<CartItem, "id" | "createdAt" | "updatedAt">
) {
    const cartCollection = getCartCollection();

    const existingItemQuery = query(
        cartCollection,
        where("productId", "==", item.productId)
    );

    const snapshot = await getDocs(existingItemQuery);

    if (!snapshot.empty) {
        const existingDoc = snapshot.docs[0];

        const existingData = existingDoc.data() as CartItem;

        await updateDoc(existingDoc.ref, {
            quantity: existingData.quantity + item.quantity,
            updatedAt: serverTimestamp(),
        });

        return;
    }

    await addDoc(cartCollection, {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}

export async function updateCartItem(
    id: string,
    quantity: number
) {
    await updateDoc(
        doc(getCartCollection(), id),
        {
            quantity,
            updatedAt: serverTimestamp(),
        }
    );
}

export async function deleteCartItem(id: string) {
    await deleteDoc(doc(getCartCollection(), id));
}

export async function clearCart() {
  const snapshot = await getDocs(getCartCollection());

  const deletePromises = snapshot.docs.map((cartDoc) =>
    deleteDoc(cartDoc.ref)
  );

  await Promise.all(deletePromises);
}