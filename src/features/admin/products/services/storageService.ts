export async function uploadProductImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const cloudName = import.meta.env
    .VITE_CLOUDINARY_CLOUD_NAME;

  const uploadPreset = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "products");

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round(
          (event.loaded * 100) / event.total
        );

        onProgress?.(progress);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE)
        return;

      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);

        resolve(response.secure_url);
      } else {
        reject(
          new Error(
            "Failed to upload image to Cloudinary."
          )
        );
      }
    };

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    );

    xhr.send(formData);
  });
}