import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type { StoreSettings } from "../types/storeSettings";
import { DEFAULT_STORE_SETTINGS } from "../types/storeSettings";

const COLLECTION_NAME = "storeSettings";
const DOCUMENT_ID = "store";

const documentRef = doc(
  db,
  COLLECTION_NAME,
  DOCUMENT_ID,
);

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const snapshot = await getDoc(documentRef);

    console.log("Snapshot exists:", snapshot.exists());

    if (!snapshot.exists()) {
      return DEFAULT_STORE_SETTINGS;
    }

    const data = snapshot.data();

    return {
      ...DEFAULT_STORE_SETTINGS,
      ...data,
      createdAt:
        data.createdAt?.toDate?.() ??
        DEFAULT_STORE_SETTINGS.createdAt,
      updatedAt:
        data.updatedAt?.toDate?.() ??
        DEFAULT_STORE_SETTINGS.updatedAt,
    } as StoreSettings;
  } catch (error) {
    console.error("getStoreSettings failed:", error);
    throw error;
  }
}

export async function saveStoreSettings(
  settings: StoreSettings,
): Promise<void> {
  await setDoc(
    documentRef,
    {
      ...settings,
      createdAt:
        settings.createdAt ??
        serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  );
}