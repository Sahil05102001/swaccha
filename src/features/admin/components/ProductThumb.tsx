import { Box } from "@mui/material";

import { cloudinaryThumb } from "@/features/admin/products/utils/imageUrl";

interface ProductThumbProps {
  src?: string;
  alt: string;
  size?: number;
}

/** Small product image for admin lists (a compressed copy, full image shown). */
export default function ProductThumb({ src, alt, size = 48 }: ProductThumbProps) {
  const thumb = cloudinaryThumb(src, size * 2);

  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "#FFFFFF",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {thumb && (
        <Box
          component="img"
          src={thumb}
          alt={alt}
          loading="lazy"
          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
    </Box>
  );
}