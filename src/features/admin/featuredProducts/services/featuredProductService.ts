import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type {
    FeaturedProduct,
    FeaturedProductFormData,
} from "../types/featuredProduct";

const COLLECTION_NAME = "featuredProducts";

const featuredProductsRef = collection(
    db,
    COLLECTION_NAME
);

export async function getFeaturedProducts(): Promise<
    FeaturedProduct[]
> {
    const q = query(
        featuredProductsRef,
        orderBy("displayOrder", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((snapshotDoc) => {
        const data = snapshotDoc.data();

        return {
            id: snapshotDoc.id,
            productId: data.productId ?? "",
            displayOrder: data.displayOrder ?? 1,
            isActive: Boolean(data.isActive),
        };
    });
}

export async function addFeaturedProduct(
    data: FeaturedProductFormData
): Promise<void> {
    const documentRef = doc(featuredProductsRef);

    await setDoc(documentRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}

export async function updateFeaturedProduct(
    id: string,
    data: FeaturedProductFormData
): Promise<void> {
    await setDoc(
        doc(db, COLLECTION_NAME, id),
        {
            ...data,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}

export async function deleteFeaturedProduct(
    id: string
): Promise<void> {
    await deleteDoc(
        doc(db, COLLECTION_NAME, id)
    );
}