
export interface HeroBanner {
  id: string;

  desktopImageUrl: string;
  desktopImagePublicId: string;

  mobileImageUrl: string;
  mobileImagePublicId: string;

  bannerLink: string;

  badgeText: string;
  heading: string;
  description: string;

  primaryButtonText: string;
  primaryButtonLink: string;

  secondaryButtonText: string;
  secondaryButtonLink: string;

  offerText: string;

  isActive: boolean;
  displayOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface HeroBannerFormData {
  desktopImageUrl: string;
  desktopImagePublicId: string;

  mobileImageUrl: string;
  mobileImagePublicId: string;

  bannerLink: string;

  badgeText: string;
  heading: string;
  description: string;

  primaryButtonText: string;
  primaryButtonLink: string;

  secondaryButtonText: string;
  secondaryButtonLink: string;

  offerText: string;

  isActive: boolean;
  displayOrder: number;
}

export const DEFAULT_HERO_BANNER: HeroBannerFormData = {
  desktopImageUrl: "",
  desktopImagePublicId: "",

  mobileImageUrl: "",
  mobileImagePublicId: "",

  bannerLink: "/products",

  badgeText: "Everyday Cleaning Essentials",
  heading: "Cleaning made simple.",
  description:
    "Reliable housekeeping products for homes, businesses and everyday cleaning needs.",

  primaryButtonText: "Shop Now",
  primaryButtonLink: "/products",

  secondaryButtonText: "Explore Products",
  secondaryButtonLink: "/products",

  offerText: "Clean Smarter Every Day",

  isActive: true,
  displayOrder: 1,
};
