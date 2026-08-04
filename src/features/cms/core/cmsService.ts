import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export async function getCmsDocument<T>(
  documentId: string,
  defaultValue: T,
): Promise<T> {
  const documentRef = doc(
    db,
    "cms",
    documentId,
  );

  const snapshot = await getDoc(documentRef);

  if (!snapshot.exists()) {
    return defaultValue;
  }

  const data = snapshot.data();

  return {
    ...defaultValue,
    ...data,
    createdAt:
      data.createdAt?.toDate?.() ??
      (defaultValue as Record<string, unknown>)
        .createdAt ??
      null,
    updatedAt:
      data.updatedAt?.toDate?.() ??
      (defaultValue as Record<string, unknown>)
        .updatedAt ??
      null,
  } as T;
}

export async function saveCmsDocument<T>(
  documentId: string,
  data: T,
): Promise<void> {
  const documentRef = doc(
    db,
    "cms",
    documentId,
  );

  await setDoc(
    documentRef,
    {
      ...data,
      createdAt:
        (data as Record<string, unknown>)
          .createdAt ??
        serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  );
}