import { auth } from "@/firebase/auth";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL as string | undefined
)?.replace(/\/+$/, "");

/**
 * For a signature uploaded before the public ID was being saved:
 * works out the ID from the image address.
 */
export function publicIdFromCloudinaryUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname !== "res.cloudinary.com") return null;

    const segments = parsed.pathname.split("/").filter(Boolean);

    // /<cloud>/image/upload/[v123/]<public id>.<extension>
    if (
      segments.length < 4 ||
      segments[1] !== "image" ||
      segments[2] !== "upload"
    ) {
      return null;
    }

    const rest = segments.slice(3);
    const versionIndex = rest.findIndex((segment) => /^v\d+$/.test(segment));
    const idSegments = versionIndex >= 0 ? rest.slice(versionIndex + 1) : rest;

    if (idSegments.length === 0) return null;

    const last = idSegments.length - 1;
    idSegments[last] = idSegments[last].replace(/\.[^.]+$/, "");

    return decodeURIComponent(idSegments.join("/"));
  } catch {
    return null;
  }
}

/** Deletes the signature image from Cloudinary (admin only, via the backend). */
export async function deleteStoreSignatureImage(
  publicId: string,
): Promise<void> {
  const id = publicId.trim();

  if (!id) return;

  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in as an administrator.");
  }

  const idToken = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}/hero-images`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId: id }),
  });

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
  } | null;

  if (!response.ok || result?.success !== true) {
    throw new Error(result?.message ?? "The signature could not be deleted.");
  }
}