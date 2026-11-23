export interface ImageSpec {
  width: number;
  height: number;
  kb: number;
  warnKb: number;
  minWidth: number;
  maxWidth: number;
  /** Words used in the advice, e.g. "4:1 wide banner". */
  shape: string;
  /** Adds a reminder to keep banners the same shape. */
  keepSameShape?: boolean;
}

/** Looks at the chosen file and returns friendly advice (never blocks). */
export function checkImageFile(file: File, spec: ImageSpec): Promise<string[]> {
  return new Promise((resolve) => {
    const notes: string[] = [];
    const kb = Math.round(file.size / 1024);

    if (kb > spec.warnKb) {
      notes.push(
        `This image is ${kb} KB. Aim for about ${spec.kb} KB, because lighter images make the store load faster.`,
      );
    }

    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const w = image.naturalWidth;
      const h = image.naturalHeight;
      const target = spec.width / spec.height;

      if (Math.abs(w / h - target) / target > 0.1) {
        notes.push(
          `This image is ${w} × ${h} px. The recommended shape is ${spec.shape} (${spec.width} × ${spec.height} px).${
            spec.keepSameShape
              ? " Keep the same shape every time, otherwise the page can jump."
              : ""
          }`,
        );
      }

      if (w < spec.minWidth) {
        notes.push("This image is small and may look blurry on large screens.");
      }

      if (w > spec.maxWidth) {
        notes.push(
          `This image is larger than needed. ${spec.width} px wide is enough and loads faster.`,
        );
      }

      URL.revokeObjectURL(url);
      resolve(notes);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(notes);
    };

    image.src = url;
  });
}