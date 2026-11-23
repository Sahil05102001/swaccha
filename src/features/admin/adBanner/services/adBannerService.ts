import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/firebase/firestore";
import {
  commitWithImages,
  getCloudinaryPublicIdFromUrl,
  type SaveWithImagesResult,
} from "@/features/admin/media/cloudinaryImages";

import type { AdBanner } from "../types/adBanner";

const COLLECTION_NAME = "adBanner";
const DOCUMENT_ID = "main";

const adBannerRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);

export interface SaveAdBannerInput {
  altText: string;
  href: string;
  isActive: boolean;
  /** New images chosen in the form. Nothing is uploaded until save. */
  files: { desktop?: File | null; mobile?: File | null };
}

export async function getAdBanner(): Promise<AdBanner | null> {
  const snapshot = await getDoc(adBannerRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  const legacyImageUrl = data.imageUrl ?? "";
  const desktopImageUrl = data.desktopImageUrl ?? legacyImageUrl;
  const mobileImageUrl =
    data.mobileImageUrl ?? desktopImageUrl ?? legacyImageUrl;

  return {
    id: snapshot.id,

    imageUrl: legacyImageUrl || desktopImageUrl || "",

    desktopImageUrl,
    mobileImageUrl,

    desktopImagePublicId:
      data.desktopImagePublicId ||
      getCloudinaryPublicIdFromUrl(desktopImageUrl),

    mobileImagePublicId:
      data.mobileImagePublicId ||
      getCloudinaryPublicIdFromUrl(mobileImageUrl),

    altText: data.altText ?? "Advertisement",
    href: data.href ?? "",
    isActive: Boolean(data.isActive),

    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function saveAdBanner(
  input: SaveAdBannerInput,
): Promise<SaveWithImagesResult> {
  const previousSnapshot = await getDoc(adBannerRef);
  const previous = previousSnapshot.exists() ? previousSnapshot.data() : null;

  const previousDesktopUrl: string =
    previous?.desktopImageUrl ?? previous?.imageUrl ?? "";

  const previousMobileUrl: string =
    previous?.mobileImageUrl ?? previousDesktopUrl;

  const previousDesktopId: string =
    previous?.desktopImagePublicId ||
    getCloudinaryPublicIdFromUrl(previousDesktopUrl);

  const previousMobileId: string =
    previous?.mobileImagePublicId ||
    getCloudinaryPublicIdFromUrl(previousMobileUrl);

  // Check this before uploading anything.
  if (
    (!input.files.desktop && !previousDesktopUrl) ||
    (!input.files.mobile && !previousMobileUrl)
  ) {
    throw new Error("Please choose both a desktop image and a mobile image.");
  }

  return commitWithImages(
    {
      desktop: {
        folder: "ad-banners/desktop",
        current: { url: previousDesktopUrl, publicId: previousDesktopId },
        file: input.files.desktop,
      },
      mobile: {
        folder: "ad-banners/mobile",
        current: { url: previousMobileUrl, publicId: previousMobileId },
        file: input.files.mobile,
      },
    },
    async (images) => {
      await setDoc(
        adBannerRef,
        {
          altText: input.altText,
          href: input.href,
          isActive: input.isActive,

          // Legacy field stays in step with the desktop image.
          imageUrl: images.desktop.url,

          desktopImageUrl: images.desktop.url,
          desktopImagePublicId: images.desktop.publicId,
          mobileImageUrl: images.mobile.url,
          mobileImagePublicId: images.mobile.publicId,

          updatedAt: serverTimestamp(),
          ...(previousSnapshot.exists() ? {} : { createdAt: serverTimestamp() }),
        },
        { merge: true },
      );
    },
  );
}