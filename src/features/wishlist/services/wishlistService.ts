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


function getWishlistCollection() {
  const user = auth.currentUser;


  if (!user) {
    throw new Error("User is not authenticated.");
  }


  return collection(db, "users", user.uid, "wishlist");
}


/** Only the saved product ids. Product details come from the cached product list. */
export async function getWishlistIds(): Promise<string[]> {
  const wishlistSnapshot = await getDocs(getWishlistCollection());


  return wishlistSnapshot.docs.map((wishlistDoc) => wishlistDoc.id);
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