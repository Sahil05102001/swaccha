import { doc, getDoc } from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import { DEFAULT_TAX, GST_RATES, type TaxSettings } from "../types/tax";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

const isRate = (value: unknown): value is number =>
  typeof value === "number" && GST_RATES.includes(value as never);

export async function getTaxSettings(): Promise<TaxSettings> {
  const snap = await getDoc(doc(db, "storeSettings", "tax"));
  if (!snap.exists()) return DEFAULT_TAX;

  const d = snap.data();

  return {
    enabled: d.enabled === true,
    gstin: typeof d.gstin === "string" ? d.gstin : "",
    legalName: typeof d.legalName === "string" ? d.legalName : "",
    address: typeof d.address === "string" ? d.address : "",
    state: typeof d.state === "string" ? d.state : DEFAULT_TAX.state,
    defaultRatePercent: isRate(d.defaultRatePercent)
      ? d.defaultRatePercent
      : DEFAULT_TAX.defaultRatePercent,
    shippingRatePercent: isRate(d.shippingRatePercent)
      ? d.shippingRatePercent
      : DEFAULT_TAX.shippingRatePercent,
  };
}

export async function saveTaxSettings(settings: TaxSettings) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to continue.");

  const response = await fetch(`${API_BASE_URL}/admin/tax`, {
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
    throw new Error(result?.message ?? "Could not save tax settings.");
  }
}