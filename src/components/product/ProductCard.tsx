import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s ease",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 8,
        },
      }}
    >
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        sx={{
          height: 280,
          objectFit: "contain",
          p: 3,
          bgcolor: "#fafafa",
        }}
      />

      <CardContent>
        {product.badge && (
          <Chip
            label={product.badge}
            color="success"
            size="small"
            sx={{
              mb: 2,
            }}
          />
        )}

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
          }}
        >
          {product.description}
        </Typography>

        <Typography
          variant="h5"
          color="primary"
          sx={{
            fontWeight: 700,
            mb: 3,
          }}
        >
          ₹{product.price}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCartOutlinedIcon />}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}