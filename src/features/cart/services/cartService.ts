import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
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
  const productRef = doc(db, "products", item.productId);
  const productSnapshot = await getDoc(productRef);

  if (!productSnapshot.exists()) {
    throw new Error("Product not found.");
  }

  const productData = productSnapshot.data() as {
    stock: number;
  };

  if (productData.stock <= 0) {
    throw new Error("This product is out of stock.");
  }

  const cartCollection = getCartCollection();

  const existingItemQuery = query(
    cartCollection,
    where("productId", "==", item.productId)
  );

  const snapshot = await getDocs(existingItemQuery);

  if (!snapshot.empty) {
    const existingDoc = snapshot.docs[0];
    const existingData = existingDoc.data() as CartItem;

    const newQuantity =
      existingData.quantity + item.quantity;

    if (newQuantity > productData.stock) {
      throw new Error(
        `Only ${productData.stock} item${
          productData.stock > 1 ? "s" : ""
        } available in stock.`
      );
    }

    await updateDoc(existingDoc.ref, {
      quantity: newQuantity,
      updatedAt: serverTimestamp(),
    });

    return;
  }

  if (item.quantity > productData.stock) {
    throw new Error(
      `Only ${productData.stock} item${
        productData.stock > 1 ? "s" : ""
      } available in stock.`
    );
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
  await updateDoc(doc(getCartCollection(), id), {
    quantity,
    updatedAt: serverTimestamp(),
  });
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