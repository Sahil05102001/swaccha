
export interface CloudinaryVideoUploadResult {
  secureUrl: string;
  publicId: string;
}

export interface CloudinaryImageUploadResult {
  secureUrl: string;
  publicId: string;
}

interface CloudinaryUploadConfig {
  cloudName: string;
  uploadPreset: string;
}

function getCloudinaryConfig(): CloudinaryUploadConfig {
  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error(
      "Cloudinary cloud name is not configured.",
    );
  }

  if (!uploadPreset) {
    throw new Error(
      "Cloudinary upload preset is not configured.",
    );
  }

  return { cloudName, uploadPreset };
}

function getProductCloudinaryConfig(): CloudinaryUploadConfig {
  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_PRODUCT_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error(
      "Cloudinary cloud name is not configured.",
    );
  }

  if (!uploadPreset) {
    throw new Error(
      "Cloudinary product upload preset is not configured.",
    );
  }

  return { cloudName, uploadPreset };
}

function normalizeFolder(folder: string): string {
  const normalizedFolder = folder
    .trim()
    .replace(/^\/+|\/+$/g, "");

  if (!normalizedFolder) {
    throw new Error(
      "Cloudinary upload folder is required.",
    );
  }

  return normalizedFolder;
}

/**
 * Shared image upload implementation.
 * The supplied preset determines which Cloudinary configuration is used.
 */
function uploadImageRequest(
  file: File,
  folder: string,
  config: CloudinaryUploadConfig,
  onProgress?: (progress: number) => void,
): Promise<CloudinaryImageUploadResult> {
  const normalizedFolder = normalizeFolder(folder);
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", config.uploadPreset);
  formData.append("asset_folder", normalizedFolder);

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round(
          (event.loaded * 100) / event.total,
        );

        onProgress?.(progress);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) {
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);

          if (!response.secure_url || !response.public_id) {
            reject(
              new Error(
                "Cloudinary did not return the required image information.",
              ),
            );
            return;
          }

          resolve({
            secureUrl: response.secure_url,
            publicId: response.public_id,
          });
        } catch {
          reject(
            new Error(
              "Invalid response received from Cloudinary.",
            ),
          );
        }

        return;
      }

      let errorMessage =
        "Failed to upload image to Cloudinary.";

      try {
        const response = JSON.parse(xhr.responseText);
        errorMessage =
          response?.error?.message ?? errorMessage;
      } catch {
        // Keep the default error message.
      }

      reject(new Error(errorMessage));
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Network error while uploading image to Cloudinary.",
        ),
      );
    };

    xhr.onabort = () => {
      reject(new Error("Image upload was cancelled."));
    };

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    );

    xhr.send(formData);
  });
}

/**
 * Existing shared image uploader.
 * Used by hero banners, categories and other media.
 * Continues using VITE_CLOUDINARY_UPLOAD_PRESET.
 */
export function uploadImageWithDetails(
  file: File,
  folder: string,
  onProgress?: (progress: number) => void,
): Promise<CloudinaryImageUploadResult> {
  return uploadImageRequest(
    file,
    folder,
    getCloudinaryConfig(),
    onProgress,
  );
}

/**
 * Dedicated product image uploader.
 * Uses VITE_CLOUDINARY_PRODUCT_UPLOAD_PRESET.
 */
export function uploadProductImageWithDetails(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<CloudinaryImageUploadResult> {
  return uploadImageRequest(
    file,
    "products",
    getProductCloudinaryConfig(),
    onProgress,
  );
}

/**
 * Backward-compatible shared image uploader.
 * Existing callers continue receiving a URL string.
 */
export async function uploadImage(
  file: File,
  folder: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const result = await uploadImageWithDetails(
    file,
    folder,
    onProgress,
  );

  return result.secureUrl;
}

export async function uploadVideo(
  file: File,
  folder: string,
  onProgress?: (progress: number) => void,
): Promise<CloudinaryVideoUploadResult> {
  const { cloudName, uploadPreset } =
    getCloudinaryConfig();

  const normalizedFolder = normalizeFolder(folder);

  if (!file.type.startsWith("video/")) {
    throw new Error(
      "Please select a valid video file.",
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("asset_folder", normalizedFolder);

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round(
          (event.loaded * 100) / event.total,
        );

        onProgress?.(progress);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) {
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);

          if (!response.secure_url || !response.public_id) {
            reject(
              new Error(
                "Cloudinary did not return the required video information.",
              ),
            );
            return;
          }

          resolve({
            secureUrl: response.secure_url,
            publicId: response.public_id,
          });
        } catch {
          reject(
            new Error(
              "Invalid response received from Cloudinary.",
            ),
          );
        }

        return;
      }

      let errorMessage =
        "Failed to upload video to Cloudinary.";

      try {
        const response = JSON.parse(xhr.responseText);
        errorMessage =
          response?.error?.message ?? errorMessage;
      } catch {
        // Keep the default error message.
      }

      reject(new Error(errorMessage));
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Network error while uploading video to Cloudinary.",
        ),
      );
    };

    xhr.onabort = () => {
      reject(new Error("Video upload was cancelled."));
    };

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    );

    xhr.send(formData);
  });
}

/**
 * Backward-compatible product uploader.
 * Retained for any existing callers.
 */
export function uploadProductImage(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  return uploadImage(file, "products", onProgress);
}
