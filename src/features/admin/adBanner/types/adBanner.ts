export interface AdBanner {
  id: string;

  imageUrl: string;

  altText: string;

  href: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface AdBannerFormData {
  imageUrl: string;

  altText: string;

  href: string;

  isActive: boolean;
}

export const DEFAULT_AD_BANNER: AdBannerFormData = {
  imageUrl: "",

  altText: "Advertisement",

  href: "",

  isActive: true,
};