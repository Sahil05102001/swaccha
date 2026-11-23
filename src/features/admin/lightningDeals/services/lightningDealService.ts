import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";
import {
  getCmsDocument,
  saveCmsDocument,
} from "@/features/cms/core/cmsService";

import {
  DEFAULT_LIGHTNING_SETTINGS,
  type LightningDeal,
  type LightningDealFormData,
  type LightningDealsSettings,
} from "../types/lightningDeal";

const COLLECTION_NAME = "lightningDeals";
const SETTINGS_DOC_ID = "lightning-deals";

const dealsCollection = collection(db, COLLECTION_NAME);

export async function getLightningDeals(): Promise<LightningDeal[]> {
  const snapshot = await getDocs(
    query(dealsCollection, orderBy("sortOrder", "asc")),
  );

  return snapshot.docs.map((document) => {
    const data = document.data();

    return {
      id: document.id,
      productId: data.productId ?? "",
      sortOrder: Number(data.sortOrder ?? 0),
      isActive: Boolean(data.isActive),
    };
  });
}

export async function createLightningDeal(
  data: LightningDealFormData,
): Promise<void> {
  await addDoc(dealsCollection, {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function updateLightningDeal(
  id: string,
  data: LightningDealFormData,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, id), {
    ...data,
    updatedAt: new Date(),
  });
}

export async function deleteLightningDeal(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

export async function getLightningDealsSettings(): Promise<LightningDealsSettings> {
  const data = await getCmsDocument<Partial<LightningDealsSettings>>(
    SETTINGS_DOC_ID,
    DEFAULT_LIGHTNING_SETTINGS,
  );

  return { ...DEFAULT_LIGHTNING_SETTINGS, ...data };
}

export async function saveLightningDealsSettings(
  data: LightningDealsSettings,
): Promise<void> {
  await saveCmsDocument<LightningDealsSettings>(SETTINGS_DOC_ID, data);
}