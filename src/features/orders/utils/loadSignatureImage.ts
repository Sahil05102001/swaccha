import type { SignatureImage } from "./pdfLayout";

// Asks Cloudinary for a PNG (keeps the transparent background) at a sensible size.
const asPng = (url: string) =>
  url.includes("res.cloudinary.com") && url.includes("/upload/")
    ? url.replace("/upload/", "/upload/f_png,w_600/")
    : url;

/**
 * Loads the owner's signature so it can be drawn on the PDF.
 * Never throws: if anything goes wrong the invoice is still produced, just unsigned.
 */
export function loadSignatureImage(url: string): Promise<SignatureImage | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    const timer = window.setTimeout(() => resolve(null), 8000);

    image.onload = () => {
      window.clearTimeout(timer);

      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext("2d");

        if (!context || !canvas.width || !canvas.height) {
          resolve(null);
          return;
        }

        context.drawImage(image, 0, 0);

        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: canvas.width,
          height: canvas.height,
        });
      } catch {
        resolve(null);
      }
    };

    image.onerror = () => {
      window.clearTimeout(timer);
      resolve(null);
    };

    image.src = asPng(url);
  });
}