import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type {
  GlobalProductStickerSettings,
  OfferZoneProduct,
  OfferZoneProductFormData,
} from "../types/offerZone";

import { MAX_OFFER_ZONE_PRODUCTS } from "../types/offerZone";

const OFFER_ZONE_COLLECTION =
  "offerZoneProducts";

const SETTINGS_COLLECTION =
  "storeSettings";

const SETTINGS_DOCUMENT =
  "productStickerSettings";

const offerZoneProductsRef = collection(
  db,
  OFFER_ZONE_COLLECTION
);

export async function getOfferZoneProducts(): Promise<
  OfferZoneProduct[]
> {
  const snapshot = await getDocs(
    offerZoneProductsRef
  );

  return snapshot.docs.map((snapshotDoc) => {
    const data = snapshotDoc.data();

    return {
      id: snapshotDoc.id,
      productId: data.productId ?? "",
      promotionalSticker: {
        isEnabled: Boolean(
          data.promotionalSticker?.isEnabled
        ),
        text:
          data.promotionalSticker?.text ?? "",
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
}

export async function addOfferZoneProduct(
  data: OfferZoneProductFormData
): Promise<void> {
  const existingSnapshot = await getDoc(
    doc(
      db,
      OFFER_ZONE_COLLECTION,
      data.productId
    )
  );

  if (existingSnapshot.exists()) {
    throw new Error(
      "This product is already in the Offer Zone."
    );
  }

  const currentProductsSnapshot =
    await getDocs(offerZoneProductsRef);

  if (
    currentProductsSnapshot.size >=
    MAX_OFFER_ZONE_PRODUCTS
  ) {
    throw new Error(
      `Offer Zone cannot contain more than ${MAX_OFFER_ZONE_PRODUCTS} products.`
    );
  }

  await setDoc(
    doc(
      db,
      OFFER_ZONE_COLLECTION,
      data.productId
    ),
    {
      productId: data.productId,
      promotionalSticker:
        data.promotionalSticker,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}

export async function updateOfferZoneProduct(
  id: string,
  data: OfferZoneProductFormData
): Promise<void> {
  await setDoc(
    doc(
      db,
      OFFER_ZONE_COLLECTION,
      id
    ),
    {
      productId: id,
      promotionalSticker:
        data.promotionalSticker,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

export async function deleteOfferZoneProduct(
  id: string
): Promise<void> {
  await deleteDoc(
    doc(
      db,
      OFFER_ZONE_COLLECTION,
      id
    )
  );
}

export async function getGlobalProductStickerSettings(): Promise<
  GlobalProductStickerSettings | null
> {
  const snapshot = await getDoc(
    doc(
      db,
      SETTINGS_COLLECTION,
      SETTINGS_DOCUMENT
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    promotionalSticker: {
      isEnabled: Boolean(
        data.promotionalSticker?.isEnabled
      ),
      text:
        data.promotionalSticker?.text ?? "",
    },

    rotatingSticker: {
      isEnabled: Boolean(
        data.rotatingSticker?.isEnabled
      ),
      texts:
        Array.isArray(
          data.rotatingSticker?.texts
        )
          ? data.rotatingSticker.texts
          : [],
      intervalSeconds:
        Number(
          data.rotatingSticker
            ?.intervalSeconds
        ) || 3,
    },

    globalBadge: {
      text:
        typeof data.globalBadge?.text === "string"
          ? data.globalBadge.text
          : "",
    },
  };
}

export async function saveGlobalProductStickerSettings(
  settings: GlobalProductStickerSettings
): Promise<void> {
  await setDoc(
    doc(
      db,
      SETTINGS_COLLECTION,
      SETTINGS_DOCUMENT
    ),
    {
      promotionalSticker:
        settings.promotionalSticker,

      rotatingSticker:
        settings.rotatingSticker,

      globalBadge: settings.globalBadge,

      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}