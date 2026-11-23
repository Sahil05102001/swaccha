import type { Timestamp } from "firebase/firestore";

export const GST_RATES = [0, 0.25, 3, 5, 18, 40] as const;

export interface TaxSettings {
  enabled: boolean;
  gstin: string;
  legalName: string;
  address: string;
  state: string;
  defaultRatePercent: number;
  shippingRatePercent: number;
}

export const DEFAULT_TAX: TaxSettings = {
  enabled: false,
  gstin: "",
  legalName: "",
  address: "",
  state: "Maharashtra",
  defaultRatePercent: 18,
  shippingRatePercent: 18,
};

// All amounts below are in paise, exactly as the server saves them.
export interface OrderTaxLine {
  productId: string;
  name: string;
  hsnCode: string;
  quantity: number;
  ratePercent: number;
  grossPaise: number;
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
}

export type OrderTax =
  | { applied: false }
  | {
    applied: true;
    gstin: string;
    legalName: string;
    address: string;
    sellerState: string;
    placeOfSupply: string;
    intraState: boolean;
    lines: OrderTaxLine[];
    shipping: OrderTaxLine | null;
    taxablePaise: number;
    cgstPaise: number;
    sgstPaise: number;
    igstPaise: number;
    totalTaxPaise: number;
    grossPaise: number;
  };

export interface CreditNoteLine {
  ratePercent: number;
  grossPaise: number;
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
}

export interface CreditNoteInfo {
  number: string;
  issuedAt: Timestamp;
  lines: CreditNoteLine[];
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
}