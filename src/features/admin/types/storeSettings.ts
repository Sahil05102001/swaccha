export type CurrencyCode =
  | "INR"
  | "USD"
  | "EUR"
  | "GBP";

export interface StoreSettings {
  whoWeSupplyActive: boolean;

  id: string;

  storeName: string;

  gstNumber: string;

  addressLine1: string;

  addressLine2?: string;

  city: string;

  state: string;

  postalCode: string;

  country: string;

  phoneNumber: string;

  whatsappNumber: string;

  email: string;

  currency: CurrencyCode;

  invoicePrefix: string;

  invoiceFooter: string;

  // Shown on GST invoices and credit notes (optional).
  signatureUrl?: string;

  signerName?: string;

  signaturePublicId?: string;

  supportEmail: string;

  supportPhone: string;

  announcementTopText: string;
  announcementBottomText: string;

  createdAt: Date;

  updatedAt: Date;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  whoWeSupplyActive: true,

  id: "store",

  storeName: "Swachha",

  gstNumber: "",

  addressLine1: "",

  addressLine2: "",

  city: "",

  state: "",

  postalCode: "",

  country: "India",

  phoneNumber: "",

  whatsappNumber: "",

  email: "",

  currency: "INR",

  invoicePrefix: "INV",

  invoiceFooter:
    "Thank you for shopping with Swachha.",

  supportEmail: "",

  supportPhone: "",

  createdAt: new Date(),

  updatedAt: new Date(),

  announcementTopText:
    "🔥 BUY 1 GET 1 FREE • FREE SHIPPING ON ORDERS ABOVE ₹999 • USE CODE: SWACHHA10",

  announcementBottomText:
    "✨ NEW ARRIVALS • BULK ORDERS AVAILABLE • QUALITY CLEANING PRODUCTS • SHOP NOW",
};