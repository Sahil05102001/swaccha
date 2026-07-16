import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  selectCartItems,
} from "@/features/cart/cartSlice";

import OrderSummary from "../components/OrderSummary";

export default function CartPage() {
  const cartItems = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();

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
          sx={{
            mb: 3,
          }}
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
      maxWidth="xl"
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

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          {cartItems.map((item) => (
            <Card
              key={item.id}
              sx={{
                mb: 3,
              }}
            >
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

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          dispatch(decreaseQuantity(item.id))
                        }
                      >
                        −
                      </Button>

                      <Typography
                        sx={{
                          minWidth: 30,
                          textAlign: "center",
                          fontWeight: 700,
                        }}
                      >
                        {item.quantity}
                      </Typography>

                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          dispatch(increaseQuantity(item.id))
                        }
                      >
                        +
                      </Button>

                      <Button
                        color="error"
                        sx={{
                          ml: 2,
                        }}
                        onClick={() =>
                          dispatch(removeFromCart(item.id))
                        }
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <OrderSummary subtotal={subtotal} />
        </Grid>
      </Grid>
    </Container>
  );
}