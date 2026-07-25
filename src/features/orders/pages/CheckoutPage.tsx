import { Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AddressSection from "../components/AddressSection";
import PaymentSection from "../components/PaymentSection";
import CheckoutSummary from "../components/CheckoutSummary";
import PlaceOrderButton from "../components/PlaceOrderButton";

import { useCart, useClearCart } from "@/features/cart/hooks/useCart";
import { useAddresses } from "@/features/profile/hooks/useAddresses";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useCreateOrder } from "../hooks/useOrders";

import type { PaymentMethod } from "../types/order";

import { auth } from "@/firebase/auth";

import { useSnackbar } from "@/contexts/SnackbarContext";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

export default function CheckoutPage() {
  const { data: cartItems = [] } = useCart();
  const { data: addresses = [] } = useAddresses();
  const { data: profile } = useProfile();

  const { showSnackbar } = useSnackbar();

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      item.product.price * item.quantity,
    0
  );

  const shipping =
    subtotal > 0 ? 50 : 0;

  const total = subtotal + shipping;

  const [selectedAddressId, setSelectedAddressId] =
    useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  useEffect(() => {
    if (addresses.length === 0) return;

    const defaultAddress =
      addresses.find(
        (address) => address.isDefault
      );

    if (defaultAddress) {
      setSelectedAddressId(
        defaultAddress.id
      );
      return;
    }

    setSelectedAddressId(
      addresses[0].id
    );
  }, [addresses]);

  const navigate = useNavigate();

  const createOrderMutation =
    useCreateOrder();

  const clearCartMutation =
    useClearCart();

  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  const orderItems = cartItems.map(
    (item) => ({
      productId: item.productId,
      name: item.product.name,
      image:
        item.product.images[0] ?? "",
      price: item.product.price,
      quantity: item.quantity,
    })
  );

  const generateOrderNumber = () => {
    const now = new Date();

    const date =
      now
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

    const random = Math.floor(
      1000 + Math.random() * 9000
    );

    return `ORD-${date}-${random}`;
  };

  const handlePlaceOrder =
    async () => {
      if (cartItems.length === 0) {
        showSnackbar(
          "Your cart is empty.",
          "warning"
        );
        return;
      }

      if (!selectedAddressId) {
        showSnackbar(
          "Please select a delivery address.",
          "warning"
        );
        return;
      }

      if (!profile) {
        showSnackbar(
          "Unable to load your profile.",
          "error"
        );
        return;
      }

      const selectedAddress =
        addresses.find(
          (address) =>
            address.id ===
            selectedAddressId
        );

      if (!selectedAddress) {
        showSnackbar(
          "Selected address not found.",
          "error"
        );
        return;
      }

      try {
        await createOrderMutation.mutateAsync(
          {
            orderNumber:
              generateOrderNumber(),

            userId: user.uid,

            customerName:
              profile.name,

            customerEmail:
              profile.email,

            items: orderItems,

            shippingAddress: {
              fullName:
                selectedAddress.fullName,
              phoneNumber:
                selectedAddress.phoneNumber,
              addressLine1:
                selectedAddress.addressLine1,
              addressLine2:
                selectedAddress.addressLine2,
              city: selectedAddress.city,
              state:
                selectedAddress.state,
              postalCode:
                selectedAddress.postalCode,
              country:
                selectedAddress.country,
            },

            paymentMethod,

            paymentStatus:
              "pending",

            paymentId: undefined,

            orderStatus:
              "pending",

            subtotal,

            shippingCharge:
              shipping,

            totalAmount: total,

            trackingNumber:
              undefined,

            notes: undefined,
          }
        );

        await clearCartMutation.mutateAsync();

        navigate("/orders/success");
      } catch (error) {
        console.error(error);

        showSnackbar(
          error instanceof Error
            ? error.message
            : "Failed to place your order.",
          "error"
        );
      }
    };

  return (
    <PageContainer>
      <PageHeader
        title="Checkout"
        subtitle="Review your order and complete your purchase."
      />

      <Grid container spacing={4}>
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <Stack spacing={3}>
            <AddressSection
              selectedAddressId={
                selectedAddressId
              }
              onSelectAddress={
                setSelectedAddressId
              }
            />

            <PaymentSection
              paymentMethod={
                paymentMethod
              }
              onChange={
                setPaymentMethod
              }
            />
          </Stack>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Stack spacing={3}>
            <CheckoutSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />

            <PlaceOrderButton
              onClick={
                handlePlaceOrder
              }
              loading={
                createOrderMutation.isPending ||
                clearCartMutation.isPending
              }
            />
          </Stack>
        </Grid>
      </Grid>
    </PageContainer>
  );
}