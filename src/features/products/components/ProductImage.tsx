import { Box, Typography } from "@mui/material";

interface ProductImageProps {
  image: string;
  name: string;
}

const COLORS = {
  imageBg: "#F7F7F2",
  muted: "#68777A",
};

export default function ProductImage({
  image,
  name,
}: ProductImageProps) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",

        // A square frame is the standard shape for product photos.
        // It sizes itself from its width, so there are no fixed min/max heights to fight with.
        aspectRatio: "1 / 1",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        overflow: "hidden",

        borderRadius: "12px",

        backgroundColor: COLORS.imageBg,
      }}
    >
      {image ? (
        <Box
          component="img"
          src={image}
          alt={name}
          sx={{
            display: "block",

            width: "100%",
            height: "100%",

            // Shows the whole product, never cropped.
            objectFit: "contain",
            objectPosition: "center",

            p: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
            },
          }}
        />
      ) : (
        <Typography
          sx={{
            color: COLORS.muted,
            fontSize: "0.9rem",
          }}
        >
          No image available
        </Typography>
      )}
    </Box>
  );
}
