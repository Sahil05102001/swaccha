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
import useRazorpayCheckout from "../hooks/useRazorpayCheckout";
import buildOrderPayload from "../utils/buildOrderPayload";

import type { PaymentMethod } from "../types/order";

import { auth } from "@/firebase/auth";

import { useSnackbar } from "@/contexts/SnackbarContext";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();

  const { data: cartItems = [] } = useCart();
  const { data: addresses = [] } = useAddresses();
  const { data: profile } = useProfile();

  const createOrderMutation = useCreateOrder();
  const clearCartMutation = useClearCart();

  const { payWithRazorpay } =
    useRazorpayCheckout();

  const user = auth.currentUser;

  const [selectedAddressId, setSelectedAddressId] =
    useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  useEffect(() => {
    if (addresses.length === 0) {
      return;
    }

    const defaultAddress =
      addresses.find(
        (address) => address.isDefault,
      );

    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
      return;
    }

    setSelectedAddressId(addresses[0].id);
  }, [addresses]);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      item.product.price * item.quantity,
    0,
  );

  if (!user) {
    return null;
  }


  const shipping =
    subtotal > 0 ? 50 : 0;

  const total = subtotal + shipping;

  const orderItems = cartItems.map(
    (item) => ({
      productId: item.productId,
      name: item.product.name,
      image:
        item.product.images[0] ?? "",
      price: item.product.price,
      quantity: item.quantity,
    }),
  );

  const selectedAddress =
    addresses.find(
      (address) =>
        address.id === selectedAddressId,
    );

  const generateOrderNumber = () => {
    const now = new Date();

    const date = now
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");

    const random = Math.floor(
      1000 + Math.random() * 9000,
    );

    return `ORD-${date}-${random}`;
  };

  const createOrderAfterPayment =
    async (
      paymentStatus: "pending" | "paid",
      paymentId?: string,
    ) => {
      if (!selectedAddress || !profile) {
        throw new Error(
          "Address or profile not found.",
        );
      }

      const payload =
        buildOrderPayload({
          orderNumber:
            generateOrderNumber(),

          userId: user.uid,

          customerName: profile.name,

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

          paymentStatus,

          paymentId,

          subtotal,

          shippingCharge:
            shipping,

          totalAmount: total,
        });

      await createOrderMutation.mutateAsync(
        payload,
      );

      await clearCartMutation.mutateAsync();

      navigate("/orders/success");
    };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      showSnackbar(
        "Your cart is empty.",
        "warning",
      );
      return;
    }

    if (!selectedAddress) {
      showSnackbar(
        "Please select a delivery address.",
        "warning",
      );
      return;
    }

    if (!profile) {
      showSnackbar(
        "Unable to load your profile.",
        "error",
      );
      return;
    }

    try {
      if (paymentMethod === "cod") {
        await createOrderAfterPayment(
          "pending",
        );

        return;
      }

      await payWithRazorpay({
        amount: total,

        receipt: generateOrderNumber(),

        customerName: profile.name,

        customerEmail: profile.email,

        customerContact: profile.phone,

        onSuccess: async (
          paymentId,
        ) => {
          await createOrderAfterPayment(
            "paid",
            paymentId,
          );
        },
      });
    } catch (error) {
      console.error(error);

      showSnackbar(
        error instanceof Error
          ? error.message
          : "Failed to place order.",
        "error",
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