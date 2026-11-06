import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import type {
  AdBanner,
  AdBannerFormData,
} from "../types/adBanner";

const COLLECTION_NAME = "adBanner";
const DOCUMENT_ID = "main";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:5000"
).replace(/\/+$/, "");

const CLOUDINARY_CLOUD_NAME = "xxjcpz3y";

const adBannerRef = doc(
  db,
  COLLECTION_NAME,
  DOCUMENT_ID,
);

function getCloudinaryPublicIdFromUrl(
  imageUrl: string,
): string {
  if (!imageUrl) {
    return "";
  }

  try {
    const url = new URL(imageUrl);

    const segments = url.pathname
      .split("/")
      .filter(Boolean);

    if (
      url.hostname !== "res.cloudinary.com" ||
      segments[0] !== CLOUDINARY_CLOUD_NAME ||
      segments[1] !== "image" ||
      segments[2] !== "upload"
    ) {
      return "";
    }

    let publicIdSegments = segments.slice(3);

    if (/^v\d+$/.test(publicIdSegments[0] ?? "")) {
      publicIdSegments = publicIdSegments.slice(1);
    }

    if (publicIdSegments.length === 0) {
      return "";
    }

    const lastIndex = publicIdSegments.length - 1;

    publicIdSegments[lastIndex] =
      publicIdSegments[lastIndex].replace(/\.[^.]+$/, "");

    return publicIdSegments.join("/");
  } catch {
    return "";
  }
}

async function deleteCloudinaryAdBannerImage(
  publicId: string,
): Promise<void> {
  if (!publicId) {
    return;
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "Authentication required to delete the AdBanner image.",
    );
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch(
    `${API_BASE_URL}/hero-images`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ publicId }),
    },
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete AdBanner image (${response.status}): ${
        responseText || response.statusText
      }`,
    );
  }
}

export async function getAdBanner(): Promise<AdBanner | null> {
  const snapshot = await getDoc(adBannerRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  const legacyImageUrl = data.imageUrl ?? "";

  const desktopImageUrl =
    data.desktopImageUrl ?? legacyImageUrl;

  const mobileImageUrl =
    data.mobileImageUrl ??
    desktopImageUrl ??
    legacyImageUrl;

  return {
    id: snapshot.id,

    imageUrl:
      legacyImageUrl ||
      desktopImageUrl ||
      "",

    desktopImageUrl,
    mobileImageUrl,

    desktopImagePublicId:
      data.desktopImagePublicId ||
      getCloudinaryPublicIdFromUrl(desktopImageUrl),

    mobileImagePublicId:
      data.mobileImagePublicId ||
      getCloudinaryPublicIdFromUrl(mobileImageUrl),

    altText:
      data.altText ?? "Advertisement",

    href:
      data.href ?? "",

    isActive:
      Boolean(data.isActive),

    createdAt:
      data.createdAt?.toDate?.() ?? new Date(),

    updatedAt:
      data.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function saveAdBanner(
  data: AdBannerFormData,
): Promise<void> {
  const previousSnapshot = await getDoc(adBannerRef);

  const previousData = previousSnapshot.exists()
    ? previousSnapshot.data()
    : null;

  const previousDesktopUrl =
    previousData?.desktopImageUrl ??
    previousData?.imageUrl ??
    "";

  const previousMobileUrl =
    previousData?.mobileImageUrl ??
    previousDesktopUrl;

  const previousDesktopPublicId =
    previousData?.desktopImagePublicId ||
    getCloudinaryPublicIdFromUrl(previousDesktopUrl);

  const previousMobilePublicId =
    previousData?.mobileImagePublicId ||
    getCloudinaryPublicIdFromUrl(previousMobileUrl);

  const newDesktopPublicId =
    data.desktopImagePublicId ||
    getCloudinaryPublicIdFromUrl(
      data.desktopImageUrl || data.imageUrl,
    );

  const newMobilePublicId =
    data.mobileImagePublicId ||
    getCloudinaryPublicIdFromUrl(
      data.mobileImageUrl ||
      data.desktopImageUrl ||
      data.imageUrl,
    );

  // Save the new banner first. A Firestore failure leaves
  // the previous Cloudinary images untouched.
  await setDoc(
    adBannerRef,
    {
      ...data,

      imageUrl:
        data.desktopImageUrl ||
        data.imageUrl ||
        "",

      desktopImagePublicId: newDesktopPublicId,
      mobileImagePublicId: newMobilePublicId,

      updatedAt: serverTimestamp(),

      ...(previousSnapshot.exists()
        ? {}
        : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  );

  const retainedPublicIds = new Set(
    [newDesktopPublicId, newMobilePublicId].filter(Boolean),
  );

  const previousPublicIds = new Set(
    [previousDesktopPublicId, previousMobilePublicId].filter(Boolean),
  );

  const cleanupErrors: string[] = [];

  for (const publicId of previousPublicIds) {
    if (retainedPublicIds.has(publicId)) {
      continue;
    }

    try {
      await deleteCloudinaryAdBannerImage(publicId);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown Cloudinary deletion error";

      cleanupErrors.push(`${publicId}: ${message}`);

      console.error(
        "AdBanner saved, but Cloudinary image cleanup failed:",
        publicId,
        error,
      );
    }
  }

  // The Firestore save succeeded. Report cleanup separately
  // so the caller can distinguish it from a save failure.
  if (cleanupErrors.length > 0) {
    throw new Error(
      `Banner saved successfully, but old image cleanup failed: ${cleanupErrors.join("; ")}`,
    );
  }
}