
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import type { Product } from "@/features/products/types/product";
import type { WishlistItem } from "../types/wishlist";

function getWishlistCollection() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  return collection(db, "users", user.uid, "wishlist");
}

export async function getWishlistItems(): Promise<WishlistItem[]> {
  const wishlistSnapshot = await getDocs(getWishlistCollection());

  const products = await Promise.all(
    wishlistSnapshot.docs.map(async (wishlistDoc) => {
      const productId = wishlistDoc.id;
      const productRef = doc(db, "products", productId);
      const productSnapshot = await getDoc(productRef);

      if (!productSnapshot.exists()) {
        return null;
      }

      const productData = productSnapshot.data() as Product;

      // Exclude Firestore Timestamp objects from Redux data.
      const {
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        ...serializableProduct
      } = productData;

      return {
        ...serializableProduct,
        id: productSnapshot.id,
      } as WishlistItem;
    }),
  );

  return products.filter(
    (product): product is WishlistItem => product !== null,
  );
}

export async function addWishlistItem(
  product: Product,
): Promise<{ added: boolean }> {
  const wishlistCollection = getWishlistCollection();
  const wishlistRef = doc(wishlistCollection, product.id);

  const existingWishlistItem = await getDoc(wishlistRef);

  if (existingWishlistItem.exists()) {
    return { added: false };
  }

  const productRef = doc(db, "products", product.id);
  const productSnapshot = await getDoc(productRef);

  if (!productSnapshot.exists()) {
    throw new Error("Product not found.");
  }

  await setDoc(wishlistRef, {
    productId: product.id,
    addedAt: serverTimestamp(),
  });

  return { added: true };
}

export async function removeWishlistItem(
  productId: string,
): Promise<void> {
  const wishlistCollection = getWishlistCollection();
  const wishlistRef = doc(wishlistCollection, productId);

  await deleteDoc(wishlistRef);
}
