
import { auth } from "@/firebase/auth";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL as string | undefined
)?.replace(/\/+$/, "");

interface DeleteProductImageResponse {
  success: boolean;
  alreadyDeleted?: boolean;
  message?: string;
}

export async function deleteCloudinaryProductImage(
  publicId: string,
  productId?: string,
): Promise<void> {
  const normalizedPublicId = publicId.trim();
  const normalizedProductId = productId?.trim();

  if (!normalizedPublicId) {
    throw new Error("A product image public ID is required.");
  }

  if (productId !== undefined && !normalizedProductId) {
    throw new Error("A valid product ID is required.");
  }

  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "You must be signed in as an administrator to delete product images.",
    );
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch(`${API_BASE_URL}/product-images`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicId: normalizedPublicId,
      ...(normalizedProductId
        ? { productId: normalizedProductId }
        : {}),
    }),
  });

  let result: DeleteProductImageResponse | null = null;

  try {
    result = (await response.json()) as DeleteProductImageResponse;
  } catch {
    // Handle non-JSON responses below.
  }

  if (!response.ok || result?.success !== true) {
    throw new Error(
      result?.message ??
        "Cloudinary could not delete the product image.",
    );
  }
}
