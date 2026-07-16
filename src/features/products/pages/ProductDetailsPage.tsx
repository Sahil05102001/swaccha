import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { useParams } from "react-router-dom";

import { products } from "@/data/products";

import { addToCart } from "@/features/cart/cartSlice";

import { useAppDispatch } from "@/app/hooks";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { addToWishlist } from "@/features/wishlist/wishlistSlice";

export default function ProductDetailsPage() {
  const { slug } = useParams();

  const dispatch = useAppDispatch();

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 8,
        }}
      >
        <Typography variant="h4">
          Product Not Found
        </Typography>
      </Container>
    );
  }


  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 6,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          alignItems: "center",
        }}
      >
        {/* Left Side */}

        <Box
          sx={{
            flex: "1 1 420px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: "100%",
              maxWidth: 420,
              borderRadius: 3,
              bgcolor: "#fafafa",
              p: 4,
            }}
          />
        </Box>

        {/* Right Side */}

        <Box
          sx={{
            flex: "1 1 450px",
          }}
        >
          {product.badge && (
            <Chip
              label={product.badge}
              color="success"
              sx={{
                mb: 2,
              }}
            />
          )}

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            {product.name}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            {product.description}
          </Typography>

          <Typography
            variant="h4"
            color="primary"
            sx={{
              fontWeight: 700,
              mb: 4,
            }}
          >
            ₹{product.price}
          </Typography>

          <Divider
            sx={{
              mb: 4,
            }}
          />

          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartOutlinedIcon />}
              onClick={() => dispatch(addToCart(product))}
            >
              Add to Cart
            </Button>

            <Button
              variant="outlined"
              startIcon={<FavoriteBorderIcon />}
              onClick={() => dispatch(addToWishlist(product))}
            >
              Add to Wishlist
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}