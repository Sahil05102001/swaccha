import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import type { CartItem } from "../types/cart";

import {
  addGuestCartItem,
  clearGuestCart,
  deleteGuestCartItem,
  getGuestCartItems,
  getGuestCartMergeId,
  updateGuestCartItem,
} from "./guestCartStorage";

function getCartCollection() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  return collection(db, "users", user.uid, "cart");
}

function getStockError(stock: number): Error {
  return new Error(
    `Only ${stock} item${stock !== 1 ? "s" : ""} available in stock.`
  );
}

export async function getCartItems(): Promise<CartItem[]> {
  if (!auth.currentUser) {
    return getGuestCartItems();
  }

  const snapshot = await getDocs(getCartCollection());

  return snapshot.docs
    .filter((cartDoc) => cartDoc.data().type !== "guestCartMerge")
    .map((cartDoc) => ({
      id: cartDoc.id,
      ...cartDoc.data(),
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

  if (auth.currentUser) {
    const cartCollection = getCartCollection();

    const existingItemQuery = query(
      cartCollection,
      where("productId", "==", item.productId)
    );

    const snapshot = await getDocs(existingItemQuery);

    if (!snapshot.empty) {
      const existingDoc = snapshot.docs[0];
      const existingData = existingDoc.data() as CartItem;

      const newQuantity = existingData.quantity + item.quantity;

      if (newQuantity > productData.stock) {
        throw getStockError(productData.stock);
      }

      await updateDoc(existingDoc.ref, {
        quantity: newQuantity,
        updatedAt: serverTimestamp(),
      });

      return;
    }

    if (item.quantity > productData.stock) {
      throw getStockError(productData.stock);
    }

    await addDoc(cartCollection, {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return;
  }

  const existingItem = getGuestCartItems().find(
    (cartItem) => cartItem.productId === item.productId
  );

  const newQuantity = (existingItem?.quantity ?? 0) + item.quantity;

  if (newQuantity > productData.stock) {
    throw getStockError(productData.stock);
  }

  addGuestCartItem(item);
}

export async function updateCartItem(
  id: string,
  quantity: number
) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1.");
  }

  if (!auth.currentUser) {
    const item = getGuestCartItems().find(
      (cartItem) => cartItem.id === id
    );

    if (!item) {
      throw new Error("Cart item not found.");
    }

    const productSnapshot = await getDoc(
      doc(db, "products", item.productId)
    );

    if (!productSnapshot.exists()) {
      throw new Error("Product not found.");
    }

    const productData = productSnapshot.data() as {
      stock: number;
    };

    if (quantity > productData.stock) {
      throw getStockError(productData.stock);
    }

    updateGuestCartItem(id, quantity);
    return;
  }

  const cartItemRef = doc(getCartCollection(), id);
  const cartItemSnapshot = await getDoc(cartItemRef);

  if (!cartItemSnapshot.exists()) {
    throw new Error("Cart item not found.");
  }

  const cartItem = cartItemSnapshot.data() as CartItem;

  const productSnapshot = await getDoc(
    doc(db, "products", cartItem.productId)
  );

  if (!productSnapshot.exists()) {
    throw new Error("Product not found.");
  }

  const productData = productSnapshot.data() as {
    stock: number;
  };

  if (quantity > productData.stock) {
    throw getStockError(productData.stock);
  }

  await updateDoc(cartItemRef, {
    quantity,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCartItem(id: string) {
  if (!auth.currentUser) {
    deleteGuestCartItem(id);
    return;
  }

  await deleteDoc(doc(getCartCollection(), id));
}

export async function clearCart() {
  if (!auth.currentUser) {
    clearGuestCart();
    return;
  }

  const snapshot = await getDocs(getCartCollection());

  const deletePromises = snapshot.docs
    .filter((cartDoc) => cartDoc.data().type !== "guestCartMerge")
    .map((cartDoc) => deleteDoc(cartDoc.ref));

  await Promise.all(deletePromises);
}

/**
 * Merges the saved guest cart into the authenticated user's Firestore cart.
 *
 * A marker document is created in the same transaction as the cart updates.
 * This prevents the same guest cart from being merged more than once.
 */

export async function mergeGuestCartIntoFirestore(): Promise<void> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please log in before merging your cart.");
  }

  const guestItems = getGuestCartItems();
  const mergeId = getGuestCartMergeId();

  if (guestItems.length === 0 || !mergeId) {
    return;
  }

  const cartCollection = collection(
    db,
    "users",
    user.uid,
    "cart"
  );

  const markerRef = doc(
    cartCollection,
    `__guest_merge_${mergeId}`
  );

  const productRefs = guestItems.map((item) =>
    doc(db, "products", item.productId)
  );

  const newCartRefs = guestItems.map(() => doc(cartCollection));

  // Fetch existing cart document references outside the transaction.
  const existingCartSnapshot = await getDocs(cartCollection);

  const existingCartDocs = existingCartSnapshot.docs.filter(
    (cartDoc) => cartDoc.data().type !== "guestCartMerge"
  );

  await runTransaction(db, async (transaction) => {
    const markerSnapshot = await transaction.get(markerRef);

    if (markerSnapshot.exists()) {
      return;
    }

    // Read existing cart documents individually.
    const existingCartSnapshots = await Promise.all(
      existingCartDocs.map((cartDoc) =>
        transaction.get(cartDoc.ref)
      )
    );

    // Read all relevant products.
    const productSnapshots = await Promise.all(
      productRefs.map((productRef) =>
        transaction.get(productRef)
      )
    );

    const existingItems = new Map<
      string,
      {
        ref: (typeof existingCartDocs)[number]["ref"];
        data: CartItem;
      }
    >();

    existingCartSnapshots.forEach((cartDoc) => {
      if (!cartDoc.exists()) {
        return;
      }

      const data = cartDoc.data();

      if (
        data.type !== "guestCartMerge" &&
        typeof data.productId === "string" &&
        !existingItems.has(data.productId)
      ) {
        existingItems.set(data.productId, {
          ref: cartDoc.ref,
          data: data as CartItem,
        });
      }
    });

    // Perform all writes after the transaction reads are complete.
    guestItems.forEach((item, index) => {
      const productSnapshot = productSnapshots[index];

      if (!productSnapshot.exists()) {
        throw new Error(
          `Product "${item.product.name}" is no longer available.`
        );
      }

      const productData = productSnapshot.data() as {
        stock: number;
      };

      const stock = Math.max(0, productData.stock ?? 0);

      // Skip products that are currently out of stock.
      if (stock === 0) {
        return;
      }

      const existingItem = existingItems.get(item.productId);
      const existingQuantity = existingItem?.data.quantity ?? 0;

      const mergedQuantity = Math.min(
        existingQuantity + item.quantity,
        stock
      );

      if (existingItem) {
        transaction.update(existingItem.ref, {
          quantity: mergedQuantity,
          updatedAt: serverTimestamp(),
        });
      } else if (mergedQuantity > 0) {
        transaction.set(newCartRefs[index], {
          productId: item.productId,
          product: item.product,
          quantity: mergedQuantity,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    });

    transaction.set(markerRef, {
      type: "guestCartMerge",
      mergeId,
      createdAt: serverTimestamp(),
    });
  });

  clearGuestCart();
}