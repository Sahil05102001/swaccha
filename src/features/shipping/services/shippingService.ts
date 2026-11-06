import { doc, getDoc } from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import { DEFAULT_SHIPPING, type ShippingSettings } from "../utils/shipping";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export async function getShippingSettings(): Promise<ShippingSettings> {
  const snap = await getDoc(doc(db, "storeSettings", "shipping"));
  if (!snap.exists()) return DEFAULT_SHIPPING;

  const d = snap.data();
  const ok =
    typeof d.enabled === "boolean" &&
    (d.mode === "flat" || d.mode === "distance") &&
    Array.isArray(d.slabs) &&
    d.slabs.length > 0;

  return ok ? ({ ...DEFAULT_SHIPPING, ...d } as ShippingSettings) : DEFAULT_SHIPPING;
}

export async function saveShippingSettings(settings: ShippingSettings) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to continue.");

  const response = await fetch(`${API_BASE_URL}/admin/shipping`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await user.getIdToken()}`,
    },
    body: JSON.stringify(settings),
  });

  const result = (await response.json().catch(() => null)) as
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(result?.message ?? "Could not save shipping settings.");
  }
}