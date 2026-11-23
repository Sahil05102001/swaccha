import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";
import { uploadImageWithDetails } from "@/features/admin/products/services/storageService";

import type {
  HeroBanner,
  HeroBannerFormData,
} from "../types/heroBanner";

const COLLECTION_NAME = "heroBanners";
const MAX_HERO_BANNERS = 5;
const MIN_DISPLAY_ORDER = 1;
const MAX_DISPLAY_ORDER = 5;

const heroBannersRef = collection(db, COLLECTION_NAME);

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL as string | undefined
)?.replace(/\/+$/, "");

interface DeleteCloudinaryImageResponse {
  success: boolean;
  alreadyDeleted?: boolean;
  message?: string;
}

/** New images chosen in the form. Nothing is uploaded until Save. */
export interface HeroImageFiles {
  desktop?: File | null;
  mobile?: File | null;
}

export interface SaveHeroBannerResult {
  /** True when an old image could not be removed from Cloudinary. */
  cleanupFailed: boolean;
}

interface UploadedImage {
  url: string;
  publicId: string;
}

/**
 * Extract a Cloudinary public ID from a standard image delivery URL.
 *
 * Supports URLs such as:
 * https://res.cloudinary.com/xxjcpz3y/image/upload/v123456/folder/image.png
 *
 * Returns null for URLs that cannot be safely interpreted.
 */
function getCloudinaryPublicIdFromUrl(
  imageUrl: unknown,
): string | null {
  if (typeof imageUrl !== "string" || !imageUrl.trim()) {
    return null;
  }

  try {
    const url = new URL(imageUrl);

    if (
      url.protocol !== "https:" ||
      url.hostname !== "res.cloudinary.com" ||
      url.username ||
      url.password ||
      url.port
    ) {
      return null;
    }

    const segments = url.pathname
      .split("/")
      .filter(Boolean);

    if (
      segments.length < 4 ||
      segments[0] !== "xxjcpz3y" ||
      segments[1] !== "image" ||
      segments[2] !== "upload"
    ) {
      return null;
    }

    const assetSegments = segments.slice(3);

    // Accept an optional Cloudinary version segment.
    if (/^v\d+$/.test(assetSegments[0] ?? "")) {
      assetSegments.shift();
    }

    if (assetSegments.length === 0) {
      return null;
    }

    const lastSegment =
      assetSegments[assetSegments.length - 1];

    // Require a recognizable image extension.
    if (!/\.(avif|gif|jpe?g|png|webp|bmp|tiff?)$/i.test(lastSegment)) {
      return null;
    }

    assetSegments[assetSegments.length - 1] =
      lastSegment.replace(/\.[^.]+$/, "");

    const publicId = assetSegments.join("/");

    if (
      !publicId ||
      publicId.startsWith("/") ||
      publicId.includes("..")
    ) {
      return null;
    }

    return publicId;
  } catch {
    return null;
  }
}

function validateDisplayOrder(
  displayOrder: number,
): void {
  if (
    !Number.isInteger(displayOrder) ||
    displayOrder < MIN_DISPLAY_ORDER ||
    displayOrder > MAX_DISPLAY_ORDER
  ) {
    throw new Error(
      "Display order must be a unique number from 1 to 5.",
    );
  }
}

async function ensureDisplayOrderAvailable(
  displayOrder: number,
  excludeId?: string,
): Promise<void> {
  validateDisplayOrder(displayOrder);

  const q = query(
    heroBannersRef,
    where("displayOrder", "==", displayOrder),
  );

  const snapshot = await getDocs(q);

  const conflictingBanner = snapshot.docs.find(
    (snapshotDoc) => snapshotDoc.id !== excludeId,
  );

  if (conflictingBanner) {
    throw new Error(
      `Display order ${displayOrder} is already assigned to another hero banner.`,
    );
  }
}

async function deleteCloudinaryHeroImage(
  publicId: string,
): Promise<void> {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    throw new Error(
      "A Cloudinary public ID is required to delete a hero image.",
    );
  }

  if (!API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. The hero banner was not deleted.",
    );
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "You must be signed in as an administrator to delete hero images.",
    );
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch(
    `${API_BASE_URL}/hero-images`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicId: normalizedPublicId,
      }),
    },
  );

  let result: DeleteCloudinaryImageResponse | null = null;

  try {
    result =
      (await response.json()) as DeleteCloudinaryImageResponse;
  } catch {
    // A non-JSON response is handled as a failed request below.
  }

  if (!response.ok || result?.success !== true) {
    throw new Error(
      result?.message ??
        "Cloudinary could not delete a hero image. The banner was not deleted.",
    );
  }
}

/**
 * Best-effort removal used for cleanup. It never throws, so a cleanup
 * problem can't undo or block a save. Returns false if anything failed.
 */
async function removeImagesQuietly(
  publicIds: Array<string | null | undefined>,
): Promise<boolean> {
  const unique = Array.from(
    new Set(
      publicIds
        .map((id) => id?.trim() ?? "")
        .filter(Boolean),
    ),
  );

  let allRemoved = true;

  for (const publicId of unique) {
    try {
      await deleteCloudinaryHeroImage(publicId);
    } catch (error) {
      allRemoved = false;
      console.warn(
        "Could not remove a hero image from Cloudinary:",
        publicId,
        error,
      );
    }
  }

  return allRemoved;
}

/** Uploads only the images that were chosen. Undoes itself if one fails. */
async function uploadHeroImages(
  files: HeroImageFiles,
): Promise<{ desktop?: UploadedImage; mobile?: UploadedImage }> {
  const uploaded: {
    desktop?: UploadedImage;
    mobile?: UploadedImage;
  } = {};

  try {
    if (files.desktop) {
      const result = await uploadImageWithDetails(
        files.desktop,
        "hero-banners/desktop",
        () => undefined,
      );

      uploaded.desktop = {
        url: result.secureUrl,
        publicId: result.publicId,
      };
    }

    if (files.mobile) {
      const result = await uploadImageWithDetails(
        files.mobile,
        "hero-banners/mobile",
        () => undefined,
      );

      uploaded.mobile = {
        url: result.secureUrl,
        publicId: result.publicId,
      };
    }
  } catch (error) {
    await removeImagesQuietly([
      uploaded.desktop?.publicId,
      uploaded.mobile?.publicId,
    ]);

    throw error;
  }

  return uploaded;
}

export async function getHeroBanners(): Promise<HeroBanner[]> {
  const q = query(
    heroBannersRef,
    orderBy("displayOrder", "asc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((snapshotDoc) => {
    const data = snapshotDoc.data();

    return {
      id: snapshotDoc.id,

      desktopImageUrl: data.desktopImageUrl ?? "",
      desktopImagePublicId: data.desktopImagePublicId ?? "",

      mobileImageUrl: data.mobileImageUrl ?? "",
      mobileImagePublicId: data.mobileImagePublicId ?? "",

      bannerLink: data.bannerLink ?? "/products",
      badgeText: data.badgeText ?? "",
      heading: data.heading ?? "",
      description: data.description ?? "",
      primaryButtonText: data.primaryButtonText ?? "",
      primaryButtonLink: data.primaryButtonLink ?? "",
      secondaryButtonText: data.secondaryButtonText ?? "",
      secondaryButtonLink: data.secondaryButtonLink ?? "",
      offerText: data.offerText ?? "",
      isActive: Boolean(data.isActive),
      displayOrder: data.displayOrder ?? 1,

      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    };
  });
}

export async function addHeroBanner(
  data: HeroBannerFormData,
  files: HeroImageFiles,
): Promise<SaveHeroBannerResult> {
  if (!files.desktop || !files.mobile) {
    throw new Error(
      "Please choose both a desktop image and a mobile image.",
    );
  }

  const countSnapshot = await getCountFromServer(heroBannersRef);

  if (countSnapshot.data().count >= MAX_HERO_BANNERS) {
    throw new Error(
      "Maximum of 5 hero banners allowed.",
    );
  }

  // Check everything that can fail before uploading anything.
  await ensureDisplayOrderAvailable(data.displayOrder);

  const uploaded = await uploadHeroImages(files);

  try {
    await addDoc(heroBannersRef, {
      ...data,
      desktopImageUrl: uploaded.desktop?.url ?? "",
      desktopImagePublicId: uploaded.desktop?.publicId ?? "",
      mobileImageUrl: uploaded.mobile?.url ?? "",
      mobileImagePublicId: uploaded.mobile?.publicId ?? "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    await removeImagesQuietly([
      uploaded.desktop?.publicId,
      uploaded.mobile?.publicId,
    ]);

    throw error;
  }

  return { cleanupFailed: false };
}

export async function updateHeroBanner(
  id: string,
  data: HeroBannerFormData,
  files: HeroImageFiles,
  previous: HeroBanner,
): Promise<SaveHeroBannerResult> {
  await ensureDisplayOrderAvailable(data.displayOrder, id);

  const uploaded = await uploadHeroImages(files);

  const payload = {
    ...data,
    desktopImageUrl:
      uploaded.desktop?.url ?? data.desktopImageUrl,
    desktopImagePublicId:
      uploaded.desktop?.publicId ?? data.desktopImagePublicId,
    mobileImageUrl:
      uploaded.mobile?.url ?? data.mobileImageUrl,
    mobileImagePublicId:
      uploaded.mobile?.publicId ?? data.mobileImagePublicId,
    updatedAt: serverTimestamp(),
  };

  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), payload);
  } catch (error) {
    // The banner still points at its old images, so drop the new ones.
    await removeImagesQuietly([
      uploaded.desktop?.publicId,
      uploaded.mobile?.publicId,
    ]);

    throw error;
  }

  // The save worked. Now remove the images that were replaced.
  const stale: string[] = [];

  if (uploaded.desktop) {
    const old =
      previous.desktopImagePublicId ||
      getCloudinaryPublicIdFromUrl(previous.desktopImageUrl);
    if (old) stale.push(old);
  }

  if (uploaded.mobile) {
    const old =
      previous.mobileImagePublicId ||
      getCloudinaryPublicIdFromUrl(previous.mobileImageUrl);
    if (old) stale.push(old);
  }

  // Never delete an image the banner still uses.
  const stillUsed = new Set([
    payload.desktopImagePublicId,
    payload.mobileImagePublicId,
  ]);

  const cleaned = await removeImagesQuietly(
    stale.filter((publicId) => !stillUsed.has(publicId)),
  );

  return { cleanupFailed: !cleaned };
}

export async function deleteHeroBanner(
  id: string,
): Promise<void> {
  const bannerRef = doc(db, COLLECTION_NAME, id);
  const bannerSnapshot = await getDoc(bannerRef);

  if (!bannerSnapshot.exists()) {
    throw new Error(
      "Hero banner not found. It may have already been deleted.",
    );
  }

  const data = bannerSnapshot.data();

  const storedDesktopId =
    typeof data.desktopImagePublicId === "string"
      ? data.desktopImagePublicId.trim()
      : "";

  const storedMobileId =
    typeof data.mobileImagePublicId === "string"
      ? data.mobileImagePublicId.trim()
      : "";

  const desktopPublicId =
    storedDesktopId ||
    getCloudinaryPublicIdFromUrl(data.desktopImageUrl);

  const mobilePublicId =
    storedMobileId ||
    getCloudinaryPublicIdFromUrl(data.mobileImageUrl);

  if (!desktopPublicId || !mobilePublicId) {
    throw new Error(
      "The desktop or mobile image URL is missing or is not a supported Cloudinary URL. The banner was kept unchanged.",
    );
  }

  // Delete both images before deleting the Firestore document.
  // If one deletion fails, the banner record remains available for retry.
  await deleteCloudinaryHeroImage(desktopPublicId);

  if (mobilePublicId !== desktopPublicId) {
    await deleteCloudinaryHeroImage(mobilePublicId);
  }

  await deleteDoc(bannerRef);
}