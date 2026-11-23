import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/firebase/firestore";
import {
  commitWithImages,
  getCloudinaryPublicIdFromUrl,
  type SaveWithImagesResult,
} from "@/features/admin/media/cloudinaryImages";

import type { BrandStatement } from "../types/brandStatement";

const COLLECTION_NAME = "brandStatement";
const DOCUMENT_ID = "main";

const brandStatementRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);

export interface SaveBrandStatementInput {
  brandName: string;
  title: string;
  description: string;
  tagline: string;
  isActive: boolean;
  /** New images chosen in the form. Nothing is uploaded until save. */
  files: { desktop?: File | null; mobile?: File | null };
  /** Clear the saved image of that kind. */
  removeDesktop: boolean;
  removeMobile: boolean;
}

export async function getBrandStatement(): Promise<BrandStatement | null> {
  const snapshot = await getDoc(brandStatementRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  // Legacy image fields remain supported for existing records.
  const imageUrl = data.imageUrl ?? "";
  const imagePublicId =
    data.imagePublicId || getCloudinaryPublicIdFromUrl(imageUrl);

  const desktopImageUrl = data.desktopImageUrl || imageUrl;

  const desktopImagePublicId =
    data.desktopImagePublicId ||
    (desktopImageUrl === imageUrl
      ? imagePublicId
      : getCloudinaryPublicIdFromUrl(desktopImageUrl));

  const mobileImageUrl = data.mobileImageUrl ?? "";

  const mobileImagePublicId =
    data.mobileImagePublicId || getCloudinaryPublicIdFromUrl(mobileImageUrl);

  return {
    id: snapshot.id,

    brandName: data.brandName ?? "",
    title: data.title ?? "",
    description: data.description ?? "",
    tagline: data.tagline ?? "",

    imageUrl,
    imagePublicId,

    desktopImageUrl,
    desktopImagePublicId,
    mobileImageUrl,
    mobileImagePublicId,

    isActive: Boolean(data.isActive),

    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function saveBrandStatement(
  input: SaveBrandStatementInput,
): Promise<SaveWithImagesResult> {
  const previousSnapshot = await getDoc(brandStatementRef);
  const previous = previousSnapshot.exists() ? previousSnapshot.data() : null;

  // Existing images, including records that only have the legacy field.
  const legacyUrl: string = previous?.imageUrl ?? "";
  const legacyId: string =
    previous?.imagePublicId || getCloudinaryPublicIdFromUrl(legacyUrl);

  const desktopUrl: string = previous?.desktopImageUrl || legacyUrl;
  const desktopId: string =
    previous?.desktopImagePublicId ||
    (desktopUrl === legacyUrl
      ? legacyId
      : getCloudinaryPublicIdFromUrl(desktopUrl));

  const mobileUrl: string = previous?.mobileImageUrl ?? "";
  const mobileId: string =
    previous?.mobileImagePublicId || getCloudinaryPublicIdFromUrl(mobileUrl);

  return commitWithImages(
    {
      desktop: {
        folder: "brand-statement",
        current: { url: desktopUrl, publicId: desktopId },
        file: input.files.desktop,
        remove: input.removeDesktop,
      },
      mobile: {
        folder: "brand-statement",
        current: { url: mobileUrl, publicId: mobileId },
        file: input.files.mobile,
        remove: input.removeMobile,
      },
    },
    async (images) => {
      await setDoc(
        brandStatementRef,
        {
          brandName: input.brandName,
          title: input.title,
          description: input.description,
          tagline: input.tagline,
          isActive: input.isActive,

          // Legacy fields stay in step with the desktop banner.
          imageUrl: images.desktop.url,
          imagePublicId: images.desktop.publicId,

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