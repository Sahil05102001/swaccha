import type {
  ProductSticker,
  RotatingProductSticker,
} from "@/features/products/types/product";

export const MAX_OFFER_ZONE_PRODUCTS = 50;

export const DEFAULT_GLOBAL_PROMOTIONAL_STICKER: ProductSticker = {
  isEnabled: false,
  text: "ADD 3, PAY FOR 2",
};

export const DEFAULT_GLOBAL_ROTATING_STICKER: RotatingProductSticker = {
  isEnabled: false,
  texts: [
    "GLYCERINE CARE",
    "DEEP MOISTURE",
    "GENTLE ON SKIN",
  ],
  intervalSeconds: 3,
};

export const MAX_BADGE_LENGTH = 16;

export const DEFAULT_GLOBAL_BADGE = { text: "" };

export interface GlobalProductStickerSettings {
  promotionalSticker: ProductSticker;
  rotatingSticker: RotatingProductSticker;
  globalBadge: { text: string };
}

export interface OfferZoneProduct {
  id: string;
  productId: string;
  promotionalSticker: ProductSticker;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface OfferZoneProductFormData {
  productId: string;
  promotionalSticker: ProductSticker;
}