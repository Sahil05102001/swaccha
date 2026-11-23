import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase/firestore";

export interface SellerProfile {
  name: string;
  addressLines: string[];
  contact: string;
  footer: string;
}

const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

/**
 * The store's name, address and contact, from Store Settings. Never throws:
 * if anything is missing the invoice is still produced without them.
 */
export async function loadSellerProfile(): Promise<SellerProfile | null> {
  try {
    const snapshot = await getDoc(doc(db, "storeSettings", "store"));

    if (!snapshot.exists()) return null;

    const d = snapshot.data();

    const phone = text(d.phoneNumber) || text(d.supportPhone);
    const email = text(d.email) || text(d.supportEmail);

    return {
      name: text(d.storeName) || "Swachha",
      addressLines: [
        text(d.addressLine1),
        text(d.addressLine2),
        [text(d.city), text(d.state), text(d.postalCode)]
          .filter(Boolean)
          .join(", "),
      ].filter(Boolean),
      contact: [phone && `Phone: ${phone}`, email && `Email: ${email}`]
        .filter(Boolean)
        .join("   |   "),
      footer: text(d.invoiceFooter),
    };
  } catch {
    return null;
  }
}