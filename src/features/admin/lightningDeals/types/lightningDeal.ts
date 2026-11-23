export interface LightningDeal {
  id: string;
  productId: string;
  sortOrder: number;
  isActive: boolean;
}

export interface LightningDealFormData {
  productId: string;
  sortOrder: number;
  isActive: boolean;
}

export interface LightningDealsSettings {
  isEnabled: boolean;
  title: string;
  subtitle: string;
  /** ISO date string, empty = no countdown. */
  endsAt: string;
}

export const DEFAULT_LIGHTNING_SETTINGS: LightningDealsSettings = {
  isEnabled: true,
  title: "Lightning Deals on Combos",
  subtitle: "Grab these combo offers before time runs out",
  endsAt: "",
};