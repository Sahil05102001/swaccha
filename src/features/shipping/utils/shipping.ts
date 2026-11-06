import {
  distanceKm,
  SHOP_LOCATION,
} from "@/features/profile/utils/deliveryArea";

export interface ShippingSlab {
  upToKm: number;
  fee: number;
}

export interface ShippingSettings {
  enabled: boolean;
  mode: "flat" | "distance";
  flatFee: number;
  slabs: ShippingSlab[];
  freeAbove: number;
  smallCartBelow: number;
  smallCartFee: number;
  distanceMultiplier: number;
}

export const DEFAULT_SHIPPING: ShippingSettings = {
  enabled: false,
  mode: "distance",
  flatFee: 30,
  slabs: [
    { upToKm: 3, fee: 20 },
    { upToKm: 6, fee: 35 },
    { upToKm: 40, fee: 60 },
  ],
  freeAbove: 0,
  smallCartBelow: 0,
  smallCartFee: 0,
  distanceMultiplier: 1.3,
};

// Must match the server's formula. The server's number is the one charged.
export function calculateShipping(
  settings: ShippingSettings,
  subtotal: number,
  straightKm: number,
): { fee: number; billedKm: number } {
  const billedKm = Math.round(straightKm * settings.distanceMultiplier * 10) / 10;

  if (!settings.enabled || subtotal <= 0) return { fee: 0, billedKm };
  if (settings.freeAbove > 0 && subtotal >= settings.freeAbove) {
    return { fee: 0, billedKm };
  }

  let fee = settings.flatFee;

  if (settings.mode === "distance") {
    const slab =
      settings.slabs.find((s) => billedKm <= s.upToKm) ??
      settings.slabs[settings.slabs.length - 1];
    fee = slab.fee;
  }

  if (settings.smallCartBelow > 0 && subtotal < settings.smallCartBelow) {
    fee += settings.smallCartFee;
  }

  return { fee: Math.round(fee * 100) / 100, billedKm };
}

export function quoteForAddress(
  settings: ShippingSettings,
  subtotal: number,
  address?: { latitude?: number; longitude?: number },
) {
  const straightKm =
    typeof address?.latitude === "number" &&
    typeof address?.longitude === "number"
      ? distanceKm(
          SHOP_LOCATION.latitude,
          SHOP_LOCATION.longitude,
          address.latitude,
          address.longitude,
        )
      : 0;

  return calculateShipping(settings, subtotal, straightKm);
}