import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import {
  removeFromWishlist,
  selectWishlistItems,
} from "../wishlistSlice";

export default function WishlistPage() {
  const wishlistItems = useAppSelector(selectWishlistItems);
  const dispatch = useAppDispatch();

  if (wishlistItems.length === 0) {
    return (
      <Container
        maxWidth="md"
        sx={{
          py: 8,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 3 }}
        >
          Your wishlist is empty
        </Typography>

        <Button
          component={Link}
          to="/products"
          variant="contained"
        >
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 6,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 5,
          fontWeight: 700,
        }}
      >
        My Wishlist
      </Typography>

      <Stack spacing={3}>
        {wishlistItems.map((item) => (
          <Card key={item.id}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <CardMedia
                  component="img"
                  image={item.image}
                  sx={{
                    width: 120,
                    height: 120,
                    objectFit: "contain",
                  }}
                />

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography color="text.secondary">
                    {item.description}
                  </Typography>

                  <Typography
                    color="primary"
                    sx={{
                      mt: 2,
                      fontWeight: 700,
                    }}
                  >
                    ₹{item.price}
                  </Typography>
                </Box>

                <Button
                  color="error"
                  variant="outlined"
                  onClick={() =>
                    dispatch(removeFromWishlist(item.id))
                  }
                >
                  Remove
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}