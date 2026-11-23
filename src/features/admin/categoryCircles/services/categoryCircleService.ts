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

import { db } from "@/firebase/firestore";
import {
  commitWithImages,
  deleteCloudinaryImageById,
  getCloudinaryPublicIdFromUrl,
  type SaveWithImagesResult,
} from "@/features/admin/media/cloudinaryImages";

import type { CategoryCircle } from "../types/categoryCircle";

const COLLECTION_NAME = "categoryCircles";
const UPLOAD_FOLDER = "category-circles";
const MAX_CATEGORY_CIRCLES = 10;
const MIN_SORT_ORDER = 1;
const MAX_SORT_ORDER = 10;

const categoryCirclesCollection = collection(db, COLLECTION_NAME);

export interface CategoryCircleInput {
  label: string;
  icon: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
  /** A new image chosen in the form. Uploaded only when saved. */
  file?: File | null;
  /** Clear the saved image. */
  remove?: boolean;
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

async function ensureCategoryCircleCapacity(editingId?: string): Promise<void> {
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

function mapCategoryCircle(document: {
  id: string;
  data: () => Record<string, any>;
}): CategoryCircle {
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

export async function getCategoryCircles(): Promise<CategoryCircle[]> {
  const snapshot = await getDocs(
    query(categoryCirclesCollection, orderBy("sortOrder", "asc")),
  );

  return snapshot.docs.map(mapCategoryCircle);
}

export async function createCategoryCircle(
  input: CategoryCircleInput,
): Promise<SaveWithImagesResult> {
  validateSortOrder(input.sortOrder);
  await ensureCategoryCircleCapacity();

  return commitWithImages(
    {
      image: {
        folder: UPLOAD_FOLDER,
        current: { url: "", publicId: "" },
        file: input.file,
      },
    },
    async ({ image }) => {
      const now = new Date();

      await addDoc(categoryCirclesCollection, {
        label: input.label,
        icon: input.icon,
        href: input.href,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
        imageUrl: image.url,
        imagePublicId: image.publicId,
        createdAt: now,
        updatedAt: now,
      });
    },
  );
}

export async function updateCategoryCircle(
  id: string,
  input: CategoryCircleInput,
): Promise<SaveWithImagesResult> {
  validateSortOrder(input.sortOrder);

  const categoryRef = doc(db, COLLECTION_NAME, id);
  const categorySnapshot = await getDoc(categoryRef);

  if (!categorySnapshot.exists()) {
    throw new Error("Category circle not found.");
  }

  await ensureCategoryCircleCapacity(id);

  const previous = categorySnapshot.data();
  const previousUrl: string = previous.imageUrl ?? "";
  const previousId: string =
    (typeof previous.imagePublicId === "string" ? previous.imagePublicId.trim() : "") ||
    getCloudinaryPublicIdFromUrl(previousUrl);

  return commitWithImages(
    {
      image: {
        folder: UPLOAD_FOLDER,
        current: { url: previousUrl, publicId: previousId },
        file: input.file,
        remove: input.remove,
      },
    },
    async ({ image }) => {
      await updateDoc(categoryRef, {
        label: input.label,
        icon: input.icon,
        href: input.href,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
        imageUrl: image.url,
        imagePublicId: image.publicId,
        updatedAt: new Date(),
      });
    },
  );
}

export async function deleteCategoryCircle(id: string): Promise<void> {
  const categoryRef = doc(db, COLLECTION_NAME, id);
  const categorySnapshot = await getDoc(categoryRef);

  if (!categorySnapshot.exists()) {
    throw new Error(
      "Category circle not found. It may have already been deleted.",
    );
  }

  const data = categorySnapshot.data();

  const imageUrl = typeof data.imageUrl === "string" ? data.imageUrl.trim() : "";
  const publicId =
    (typeof data.imagePublicId === "string" ? data.imagePublicId.trim() : "") ||
    getCloudinaryPublicIdFromUrl(imageUrl);

  // An image is saved but can't be identified: keep everything unchanged.
  if (imageUrl && !publicId) {
    throw new Error(
      "The category circle image URL is unsupported. The category circle was kept unchanged.",
    );
  }

  // Delete the image first. If Cloudinary deletion fails,
  // keep the Firestore document so the operation can be retried.
  // Circles without an image (icon only) are simply deleted.
  if (publicId) {
    await deleteCloudinaryImageById(publicId);
  }

  await deleteDoc(categoryRef);
}