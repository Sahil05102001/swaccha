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
): Promise<void> {
  const countSnapshot = await getCountFromServer(heroBannersRef);

  if (countSnapshot.data().count >= MAX_HERO_BANNERS) {
    throw new Error(
      "Maximum of 5 hero banners allowed.",
    );
  }

  await ensureDisplayOrderAvailable(data.displayOrder);

  await addDoc(heroBannersRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateHeroBanner(
  id: string,
  data: HeroBannerFormData,
): Promise<void> {
  await ensureDisplayOrderAvailable(data.displayOrder, id);

  await updateDoc(
    doc(db, COLLECTION_NAME, id),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
  );
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