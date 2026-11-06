import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import type {
  CategoryCircle,
  CategoryCircleFormData,
} from "../types/categoryCircle";

const COLLECTION_NAME = "categoryCircles";
const MAX_CATEGORY_CIRCLES = 10;
const MIN_SORT_ORDER = 1;
const MAX_SORT_ORDER = 10;

const categoryCirclesCollection = collection(
  db,
  COLLECTION_NAME,
);

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL as string | undefined
)?.replace(/\/+$/, "");

interface DeleteCloudinaryImageResponse {
  success: boolean;
  alreadyDeleted?: boolean;
  message?: string;
}

function validateSortOrder(sortOrder: number): void {
  if (
    !Number.isInteger(sortOrder) ||
    sortOrder < MIN_SORT_ORDER ||
    sortOrder > MAX_SORT_ORDER
  ) {
    throw new Error(
      `Sort order must be a whole number between ${MIN_SORT_ORDER} and ${MAX_SORT_ORDER}.`,
    );
  }
}

async function ensureCategoryCircleCapacity(
  editingId?: string,
): Promise<void> {
  const snapshot = await getDocs(categoryCirclesCollection);

  // Updating an existing circle does not increase the total count.
  if (editingId && snapshot.docs.some((item) => item.id === editingId)) {
    return;
  }

  if (snapshot.size >= MAX_CATEGORY_CIRCLES) {
    throw new Error(
      `You can have a maximum of ${MAX_CATEGORY_CIRCLES} category circles. Delete an existing circle before adding another.`,
    );
  }
}

/**
 * Extract a public ID from a standard Cloudinary image URL
 * belonging to this application's Cloudinary cloud.
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

    const segments = url.pathname.split("/").filter(Boolean);

    if (
      segments.length < 4 ||
      segments[0] !== "xxjcpz3y" ||
      segments[1] !== "image" ||
      segments[2] !== "upload"
    ) {
      return null;
    }

    const assetSegments = segments.slice(3);

    // Remove the optional Cloudinary version segment.
    if (/^v\d+$/.test(assetSegments[0] ?? "")) {
      assetSegments.shift();
    }

    if (assetSegments.length === 0) {
      return null;
    }

    const lastSegment = assetSegments[assetSegments.length - 1];

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

function mapCategoryCircle(
  document: {
    id: string;
    data: () => Record<string, any>;
  },
): CategoryCircle {
  const data = document.data();

  return {
    id: document.id,
    label: data.label ?? "",
    imageUrl: data.imageUrl ?? "",
    imagePublicId: data.imagePublicId ?? "",
    icon: data.icon ?? "Category",
    href: data.href ?? "/products",
    sortOrder: Number(data.sortOrder ?? 0),
    isActive: Boolean(data.isActive),
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  };
}

async function deleteCloudinaryCategoryCircleImage(
  publicId: string,
): Promise<void> {
  if (!API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. The category circle was not deleted.",
    );
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "You must be signed in as an administrator to delete category images.",
    );
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch(`${API_BASE_URL}/hero-images`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  });

  let result: DeleteCloudinaryImageResponse | null = null;

  try {
    result = (await response.json()) as DeleteCloudinaryImageResponse;
  } catch {
    // Handle non-JSON responses below.
  }

  if (!response.ok || result?.success !== true) {
    throw new Error(
      result?.message ??
      "Cloudinary could not delete the category image. The category circle was not deleted.",
    );
  }
}


export async function getCategoryCircles(): Promise<CategoryCircle[]> {
  try {
    console.log("[CategoryCircles] Fetching collection:", COLLECTION_NAME);

    const categoryQuery = query(
      categoryCirclesCollection,
      orderBy("sortOrder", "asc"),
    );

    const snapshot = await getDocs(categoryQuery);

    console.log("[CategoryCircles] Firestore result:", {
      collection: COLLECTION_NAME,
      documentCount: snapshot.size,
      documentIds: snapshot.docs.map((document) => document.id),
    });

    return snapshot.docs.map(mapCategoryCircle);
  } catch (error) {
    console.error("[CategoryCircles] Firestore fetch failed:", error);
    throw error;
  }
}

export async function createCategoryCircle(
  data: CategoryCircleFormData,
): Promise<void> {
  validateSortOrder(data.sortOrder);
  await ensureCategoryCircleCapacity();

  const now = new Date();

  await addDoc(categoryCirclesCollection, {
    ...data,
    sortOrder: data.sortOrder,
    imageUrl: data.imageUrl ?? "",
    imagePublicId: data.imagePublicId ?? "",
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateCategoryCircle(
  id: string,
  data: CategoryCircleFormData,
): Promise<void> {
  validateSortOrder(data.sortOrder);

  const categoryRef = doc(db, COLLECTION_NAME, id);
  const categorySnapshot = await getDoc(categoryRef);

  if (!categorySnapshot.exists()) {
    throw new Error("Category circle not found.");
  }

  await ensureCategoryCircleCapacity(id);

  await updateDoc(categoryRef, {
    ...data,
    sortOrder: data.sortOrder,
    imageUrl: data.imageUrl ?? "",
    imagePublicId: data.imagePublicId ?? "",
    updatedAt: new Date(),
  });
}

export async function deleteCategoryCircle(
  id: string,
): Promise<void> {
  const categoryRef = doc(db, COLLECTION_NAME, id);
  const categorySnapshot = await getDoc(categoryRef);

  if (!categorySnapshot.exists()) {
    throw new Error(
      "Category circle not found. It may have already been deleted.",
    );
  }

  const data = categorySnapshot.data();

  const storedPublicId =
    typeof data.imagePublicId === "string"
      ? data.imagePublicId.trim()
      : "";

  const publicId =
    storedPublicId ||
    getCloudinaryPublicIdFromUrl(data.imageUrl);

  if (!publicId) {
    throw new Error(
      "The category circle image URL is missing or unsupported. The category circle was kept unchanged.",
    );
  }

  // Delete the image first. If Cloudinary deletion fails,
  // keep the Firestore document so the operation can be retried.
  await deleteCloudinaryCategoryCircleImage(publicId);

  await deleteDoc(categoryRef);
}