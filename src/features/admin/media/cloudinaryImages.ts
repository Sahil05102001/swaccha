import { auth } from "@/firebase/auth";
import { uploadImageWithDetails } from "@/features/admin/products/services/storageService";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL as string | undefined
)?.replace(/\/+$/, "");

const CLOUDINARY_CLOUD_NAME = "xxjcpz3y";

export interface StoredImage {
  url: string;
  publicId: string;
}

export interface SaveWithImagesResult {
  /** True when an old image could not be removed from Cloudinary. */
  cleanupFailed: boolean;
}

export interface ImageSlot {
  folder: string;
  /** What is saved right now ("" for both when there is no image). */
  current: StoredImage;
  /** A new file chosen in the form. */
  file?: File | null;
  /** Clear the current image. */
  remove?: boolean;
}

/** Public ID from a Cloudinary image URL of this account, or "" if unsupported. */
export function getCloudinaryPublicIdFromUrl(imageUrl: unknown): string {
  if (typeof imageUrl !== "string" || !imageUrl.trim()) return "";

  try {
    const url = new URL(imageUrl);
    const segments = url.pathname.split("/").filter(Boolean);

    if (
      url.protocol !== "https:" ||
      url.hostname !== "res.cloudinary.com" ||
      segments[0] !== CLOUDINARY_CLOUD_NAME ||
      segments[1] !== "image" ||
      segments[2] !== "upload"
    ) {
      return "";
    }

    let rest = segments.slice(3);

    if (/^v\d+$/.test(rest[0] ?? "")) rest = rest.slice(1);
    if (rest.length === 0) return "";

    const last = rest.length - 1;
    rest[last] = rest[last].replace(/\.[^.]+$/, "");

    const publicId = rest.join("/");

    return publicId.includes("..") ? "" : publicId;
  } catch {
    return "";
  }
}

interface DeleteResponse {
  success: boolean;
  message?: string;
}

/** Deletes one image through the admin-only backend route. Throws on failure. */
export async function deleteCloudinaryImageById(publicId: string): Promise<void> {
  const id = publicId.trim();

  if (!id) throw new Error("A Cloudinary public ID is required.");
  if (!API_BASE_URL) throw new Error("API base URL is not configured.");

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be signed in as an administrator to delete images.");
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch(`${API_BASE_URL}/hero-images`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId: id }),
  });

  let result: DeleteResponse | null = null;

  try {
    result = (await response.json()) as DeleteResponse;
  } catch {
    // Handled below.
  }

  if (!response.ok || result?.success !== true) {
    throw new Error(result?.message ?? "Cloudinary could not delete the image.");
  }
}

/** Cleanup that never throws. Returns false if anything could not be removed. */
export async function removeImagesQuietly(
  publicIds: Array<string | null | undefined>,
): Promise<boolean> {
  const unique = Array.from(
    new Set(publicIds.map((id) => id?.trim() ?? "").filter(Boolean)),
  );

  let allRemoved = true;

  for (const publicId of unique) {
    try {
      await deleteCloudinaryImageById(publicId);
    } catch (error) {
      allRemoved = false;
      console.warn("Could not remove an image from Cloudinary:", publicId, error);
    }
  }

  return allRemoved;
}

/**
 * Uploads new files, runs `save`, then removes replaced images.
 *
 * - Nothing is uploaded unless a file was chosen.
 * - If an upload or the save fails, this run's uploads are deleted again.
 * - Old images are deleted only after the save succeeded, and never if
 *   the saved record still uses them.
 */
export async function commitWithImages<K extends string>(
  slots: Record<K, ImageSlot>,
  save: (images: Record<K, StoredImage>) => Promise<void>,
): Promise<SaveWithImagesResult> {
  const keys = Object.keys(slots) as K[];
  const resolved = {} as Record<K, StoredImage>;
  const uploadedIds: string[] = [];
  const staleIds: string[] = [];

  try {
    for (const key of keys) {
      const slot = slots[key];

      if (slot.file) {
        const result = await uploadImageWithDetails(
          slot.file,
          slot.folder,
          () => undefined,
        );

        uploadedIds.push(result.publicId);
        resolved[key] = { url: result.secureUrl, publicId: result.publicId };
        staleIds.push(slot.current.publicId);
      } else if (slot.remove) {
        resolved[key] = { url: "", publicId: "" };
        staleIds.push(slot.current.publicId);
      } else {
        resolved[key] = slot.current;
      }
    }
  } catch (error) {
    await removeImagesQuietly(uploadedIds);
    throw error;
  }

  try {
    await save(resolved);
  } catch (error) {
    await removeImagesQuietly(uploadedIds);
    throw error;
  }

  const stillUsed = new Set(
    keys.map((key) => resolved[key].publicId).filter(Boolean),
  );

  const cleaned = await removeImagesQuietly(
    staleIds.filter((id) => id && !stillUsed.has(id)),
  );

  return { cleanupFailed: !cleaned };
}