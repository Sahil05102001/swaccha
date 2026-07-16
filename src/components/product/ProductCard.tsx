import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { useNavigate } from "react-router-dom";

import type { Product } from "@/types/product";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";

import { useAppDispatch } from "@/app/hooks";
import { addToWishlist } from "@/features/wishlist/wishlistSlice";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            dispatch(addToWishlist(product));
          }}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 1,
            bgcolor: "white",
            "&:hover": {
              bgcolor: "white",
            },
          }}
        >
          <FavoriteBorderIcon color="error" />
        </IconButton>

        <CardActionArea
          onClick={() => navigate(`/products/${product.slug}`)}
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
          </CardContent>
        </CardActionArea>
      </Box>

      <CardContent
        sx={{
          pt: 0,
        }}
      >
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