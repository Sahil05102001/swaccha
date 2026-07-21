import { Grid, Stack, Typography } from "@mui/material";
import AddressSection from "../components/AddressSection";
import PaymentSection from "../components/PaymentSection";
import CheckoutSummary from "../components/CheckoutSummary";
import PlaceOrderButton from "../components/PlaceOrderButton";
import { useCart } from "@/features/cart/hooks/useCart";
import { useEffect, useState } from "react";
import type { PaymentMethod } from "../types/order";
import { useAddresses } from "@/features/profile/hooks/useAddresses";
import { useCreateOrder } from "../hooks/useOrders";
import { useClearCart } from "@/features/cart/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/auth";

export default function CheckoutPage() {
  const { data: cartItems = [] } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;
  const { data: addresses = [] } = useAddresses();

  const [selectedAddressId, setSelectedAddressId] =
    useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  useEffect(() => {
    if (addresses.length === 0) return;

    const defaultAddress = addresses.find(
      (address) => address.isDefault
    );

    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
      return;
    }

    setSelectedAddressId(addresses[0].id);
  }, [addresses]);

  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();
  const clearCartMutation = useClearCart();
  const orderItems = cartItems.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    image: item.product.images[0], // or the appropriate image field
    price: item.product.price,
    quantity: item.quantity,
  }));

  const user = auth.currentUser;

  if (!user) {
    alert("Please sign in again.");
    return;
  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }

    const selectedAddress = addresses.find(
      (address) => address.id === selectedAddressId
    );

    if (!selectedAddress) {
      alert("Selected address not found.");
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        userId: user.uid,

        items: orderItems,

        shippingAddress: {
          fullName: selectedAddress.fullName,
          phoneNumber: selectedAddress.phoneNumber,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
        },

        paymentMethod,

        paymentStatus: "pending",

        orderStatus: "pending",

        subtotal,

        shippingCharge: shipping,

        totalAmount: total,
      });

      await clearCartMutation.mutateAsync();

      navigate("/orders/success");
    } catch (error) {
      console.error(error);
      alert("Failed to place your order.");
    }
  };
  return (
    <Stack
      spacing={4}
      sx={{
        py: 4,
        px: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
        }}
      >
        Checkout
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <AddressSection
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
            />

            <PaymentSection
              paymentMethod={paymentMethod}
              onChange={setPaymentMethod}
            />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <CheckoutSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />

            <PlaceOrderButton
              onClick={handlePlaceOrder}
              loading={
                createOrderMutation.isPending ||
                clearCartMutation.isPending
              }
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}