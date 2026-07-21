import { CardMedia } from "@mui/material";

interface ProductImageProps {
  image: string;
  name: string;
}

export default function ProductImage({
  image,
  name,
}: ProductImageProps) {
  return (
    <CardMedia
      component="img"
      image={image}
      alt={name}
      sx={{
        width: "100%",
        height: 500,
        objectFit: "cover",
        borderRadius: 3,
      }}
    />
  );
}