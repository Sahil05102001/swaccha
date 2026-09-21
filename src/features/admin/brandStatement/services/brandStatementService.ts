import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type {
    BrandStatement,
    BrandStatementFormData,
} from "../types/brandStatement";

const COLLECTION_NAME = "brandStatement";
const DOCUMENT_ID = "main";

const brandStatementRef = doc(
    db,
    COLLECTION_NAME,
    DOCUMENT_ID
);

export async function getBrandStatement(): Promise<BrandStatement | null> {
    const snapshot = await getDoc(brandStatementRef);

    if (!snapshot.exists()) {
        return null;
    }

    const data = snapshot.data();

    return {
        id: snapshot.id,
        brandName: data.brandName ?? "",
        title: data.title ?? "",
        description: data.description ?? "",
        tagline: data.tagline ?? "",
        imageUrl: data.imageUrl ?? "",
        isActive: Boolean(data.isActive),
        createdAt:
            data.createdAt?.toDate?.() ?? new Date(),
        updatedAt:
            data.updatedAt?.toDate?.() ?? new Date(),
    };
}

export async function saveBrandStatement(
    data: BrandStatementFormData
): Promise<void> {
    await setDoc(
        brandStatementRef,
        {
            ...data,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}