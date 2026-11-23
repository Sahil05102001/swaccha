export interface ExclusiveOffer {
  id: string;
  title: string;
  description: string;
}

export interface ExclusiveOffersSettings {
  isEnabled: boolean;
  heading: string;
  offers: ExclusiveOffer[];
}

export const DEFAULT_EXCLUSIVE_OFFERS: ExclusiveOffersSettings = {
  isEnabled: false,
  heading: "Exclusive Offers",
  offers: [],
};