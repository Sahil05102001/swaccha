export interface AdBanner {
  id: string;

  /**
   * Legacy desktop image field.
   * Kept for backward compatibility with
   * existing Firestore data.
   */
  imageUrl: string;

  /**
   * Responsive desktop banner image.
   */
  desktopImageUrl: string;

  /**
   * Responsive mobile banner image.
   */
  mobileImageUrl: string;

  /**
   * Cloudinary public IDs used to delete
   * the corresponding images safely.
   */
  desktopImagePublicId?: string;

  mobileImagePublicId?: string;

  altText: string;

  href: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface AdBannerFormData {
  /**
   * Legacy image field.
   * This will remain synced with the desktop image.
   */
  imageUrl: string;

  desktopImageUrl: string;

  mobileImageUrl: string;

  desktopImagePublicId?: string;

  mobileImagePublicId?: string;

  altText: string;

  href: string;

  isActive: boolean;
}

export const DEFAULT_AD_BANNER: AdBannerFormData = {
  imageUrl: "",

  desktopImageUrl: "",

  mobileImageUrl: "",

  desktopImagePublicId: "",

  mobileImagePublicId: "",

  altText: "Advertisement",

  href: "",

  isActive: true,
};