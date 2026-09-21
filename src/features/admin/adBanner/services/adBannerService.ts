import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type {
  AdBanner,
  AdBannerFormData,
} from "../types/adBanner";

const COLLECTION_NAME = "adBanner";
const DOCUMENT_ID = "main";

const adBannerRef = doc(
  db,
  COLLECTION_NAME,
  DOCUMENT_ID
);

export async function getAdBanner(): Promise<
  AdBanner | null
> {
  const snapshot = await getDoc(adBannerRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,

    imageUrl: data.imageUrl ?? "",

    altText:
      data.altText ?? "Advertisement",

    href: data.href ?? "",

    isActive:
      Boolean(data.isActive),

    createdAt:
      data.createdAt?.toDate?.() ??
      new Date(),

    updatedAt:
      data.updatedAt?.toDate?.() ??
      new Date(),
  };
}

export async function saveAdBanner(
  data: AdBannerFormData
): Promise<void> {
  await setDoc(
    adBannerRef,
    {
      ...data,

      updatedAt:
        serverTimestamp(),

      createdAt:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}