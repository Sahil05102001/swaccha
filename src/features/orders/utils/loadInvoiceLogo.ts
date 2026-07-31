import logo from "@/assets/images/logo/logo.png";

export async function loadInvoiceLogo(): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.src = logo;

    image.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Unable to create canvas context."));
        return;
      }

      context.drawImage(image, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = () => {
      reject(new Error("Failed to load invoice logo."));
    };
  });
}