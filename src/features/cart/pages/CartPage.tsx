import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

import { useAppSelector } from "@/app/hooks";
import { selectCartItems } from "@/features/cart/cartSlice";

export default function CartPage() {
  const cartItems = useAppSelector(selectCartItems);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
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
          Your cart is empty
        </Typography>

        <Button
          component={Link}
          to="/products"
          variant="contained"
        >
          Continue Shopping
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
        Shopping Cart
      </Typography>

      <Stack spacing={3}>
        {cartItems.map((item) => (
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

                  <Typography sx={{ mt: 1 }}>
                    Quantity: {item.quantity}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

        <Divider />

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          Subtotal: ₹{subtotal}
        </Typography>

        <Button
          variant="contained"
          size="large"
        >
          Proceed to Checkout
        </Button>
      </Stack>
    </Container>
  );
}