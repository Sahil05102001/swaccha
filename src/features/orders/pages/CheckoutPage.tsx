import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useShippingSettings } from "@/features/shipping/hooks/useShipping";
import {
  DEFAULT_SHIPPING,
  quoteForAddress,
} from "@/features/shipping/utils/shipping";

import AddressSection from "../components/AddressSection";
import PaymentSection from "../components/PaymentSection";
import CheckoutSummary from "../components/CheckoutSummary";
import CheckoutItems from "../components/CheckoutItems";
import PlaceOrderButton from "../components/PlaceOrderButton";

import { useClearCart } from "@/features/cart/hooks/useCart";
import { useLiveCart } from "@/features/cart/hooks/useLiveCart";
import { useAddresses } from "@/features/profile/hooks/useAddresses";
import { useProfile } from "@/features/profile/hooks/useProfile";
import useRazorpayCheckout from "../hooks/useRazorpayCheckout";
import { useCreateCodOrder } from "../hooks/useCreateCodOrder";
import SecurePaymentPartner from "../components/SecurePaymentPartner";
import { waitForOrder } from "../utils/waitForOrder";

import type { PaymentMethod } from "../types/order";

import { auth } from "@/firebase/auth";
import { useSnackbar } from "@/contexts/SnackbarContext";

import AppButton from "@/components/ui/AppButton";

import CouponBox from "../components/CouponBox";
import {
  previewCoupon,
  type AppliedCoupon,
} from "@/features/coupons/services/couponService";

import { warmBackend } from "@/lib/backendWarmup";

const COLORS = {
  white: "#FFFFFF",
  page: "#F5F7FA",
  border: "#E0E0E0",
  text: "#212121",
  muted: "#757575",
  blue: "#00D9FF",
  teal: "#007F89",
};

// Indian mobile number: 10 digits starting with 6-9.
function isValidPhone(phone: string | undefined) {
  return /^[6-9]\d{9}$/.test((phone ?? "").replace(/\D/g, ""));
}

function PageShell({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: COLORS.page,
        color: COLORS.text,
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        py: { xs: 2.5, sm: 3.5, md: 4 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          ...(center && {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }),
        }}
      >
        {children}
      </Container>
    </Box>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const { data: cartItems = [], isLoading: cartLoading } = useLiveCart();

  const { data: addresses = [] } = useAddresses();
  const { data: profile } = useProfile();

  const createCodOrderMutation = useCreateCodOrder();
  const clearCartMutation = useClearCart();

  const { payWithRazorpay } = useRazorpayCheckout();

  const user = auth.currentUser;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("razorpay");
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);

  // True while the order is being created / paid.
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  // True once the order exists and we are waiting for it to show in My Orders.
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    warmBackend();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const { data: shippingSettings, isLoading: shippingLoading } =
    useShippingSettings();

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  );

  const shippingQuote = quoteForAddress(
    shippingSettings ?? DEFAULT_SHIPPING,
    subtotal,
    selectedAddress,
  );
  const shipping = shippingQuote.fee;
  const discount = coupon?.discount ?? 0;
  const total = subtotal + shipping - discount;

  // Pre-select the default address (or the newest one), and keep the
  // selection valid if addresses are added or deleted.
  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedAddressId(null);
      return;
    }

    setSelectedAddressId((current) => {
      if (current && addresses.some((address) => address.id === current)) {
        return current;
      }

      const defaultAddress = addresses.find((address) => address.isDefault);

      return (defaultAddress ?? addresses[0]).id;
    });
  }, [addresses]);

  useEffect(() => {
    if (!coupon) return;

    let cancelled = false;

    previewCoupon({
      code: coupon.code,
      subtotal,
      paymentMethod: paymentMethod === "cod" ? "cod" : "razorpay",
      shipping,
    })
      .then((result) => {
        if (!cancelled) setCoupon(result);
      })
      .catch((error) => {
        if (cancelled) return;
        setCoupon(null);
        showSnackbar(
          `Coupon ${coupon.code} was removed: ${
            error instanceof Error ? error.message : "no longer valid."
          }`,
          "warning",
        );
      });

    return () => {
      cancelled = true;
    };
    // Only when the payment method or cart amount changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, subtotal, shipping]);

  if (!user) {
    return null;
  }

  if (cartLoading) {
    return (
      <PageShell center>
        <CircularProgress
          aria-label="Loading checkout"
          sx={{ color: COLORS.blue }}
        />
      </PageShell>
    );
  }

  if (cartItems.length === 0 && !isPlacingOrder && !confirming) {
    return (
      <PageShell>
        <Stack
          spacing={2}
          sx={{
            py: { xs: 8, md: 12 },
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "2rem" },
              color: COLORS.text,
            }}
          >
            Your cart is empty
          </Typography>

          <Typography sx={{ color: COLORS.muted }}>
            Add something to your cart before checking out.
          </Typography>

          <AppButton
            onClick={() => navigate("/products")}
            sx={{
              mt: 1,
              px: 4,
              py: 1.2,
              fontWeight: 600,
              textTransform: "none",
              color: COLORS.text,
              bgcolor: COLORS.blue,
              border: `1px solid ${COLORS.blue}`,
              boxShadow: "none",
              "&:hover": { bgcolor: COLORS.blue, boxShadow: "none" },
            }}
          >
            Continue shopping
          </AppButton>
        </Stack>
      </PageShell>
    );
  }

  // The order is already placed by the time this runs, so a failure here
  // must not look like a failed checkout (the user could order twice).
  const clearCartSafely = async () => {
    try {
      await clearCartMutation.mutateAsync();
    } catch (error) {
      console.error("Order placed, but clearing the cart failed:", error);
    }
  };

  // The order exists. Clear the cart and wait until My Orders can show it,
  // THEN open the success page.
  const finishOrder = async (orderId?: string, orderNumber?: string) => {
    setConfirming(true);

    await Promise.all([clearCartSafely(), waitForOrder(queryClient, orderId)]);

    navigate("/orders/success", {
      replace: true,
      state: { orderId: orderNumber ?? orderId },
    });
  };

  const handleCheckout = async () => {
    if (isPlacingOrder || confirming) return;

    if (cartItems.length === 0) {
      showSnackbar("Your cart is empty.", "warning");
      return;
    }

    if (!selectedAddress) {
      showSnackbar("Please add or select a delivery address.", "warning");
      return;
    }

    if (!isValidPhone(selectedAddress.phoneNumber)) {
      showSnackbar(
        "This address has no valid phone number. Tap Edit on the address to fix it.",
        "warning",
      );
      return;
    }

    if (
      typeof selectedAddress.latitude !== "number" ||
      typeof selectedAddress.longitude !== "number"
    ) {
      showSnackbar(
        "This address has no map pin. Tap Edit on the address and pin the delivery location.",
        "warning",
      );
      return;
    }

    if (!profile) {
      showSnackbar("Unable to load your profile.", "error");
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const shippingAddress = {
      fullName: selectedAddress.fullName,
      phoneNumber: selectedAddress.phoneNumber,
      addressLine1: selectedAddress.addressLine1,
      addressLine2: selectedAddress.addressLine2,
      city: selectedAddress.city,
      state: selectedAddress.state,
      postalCode: selectedAddress.postalCode,
      country: selectedAddress.country,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
      ...(selectedAddress.locationAccuracy !== undefined
        ? { locationAccuracy: selectedAddress.locationAccuracy }
        : {}),
    };

    setIsPlacingOrder(true);

    try {
      if (paymentMethod === "cod") {
        const created = await createCodOrderMutation.mutateAsync({
          items,
          shippingAddress,
          couponCode: coupon?.code,
        });

        await finishOrder(created.orderId, created.orderNumber);
        return;
      }

      await payWithRazorpay({
        items,
        shippingAddress,
        couponCode: coupon?.code,

        customerName: profile.name,
        customerEmail: profile.email,
        // The address phone is the validated number, so prefill with it.
        customerContact: selectedAddress.phoneNumber,

        onSuccess: async (result) => {
          if (!result.success) {
            throw new Error(
              result.message || "Payment verification was unsuccessful.",
            );
          }

          if (result.refundRequired) {
            showSnackbar(
              result.message ||
                "Payment was received, but this order needs refund resolution. Please contact support before placing another order.",
              "warning",
            );

            // Keep the cart so the customer can review the items.
            // Do not show the normal order-success page.
            await queryClient.invalidateQueries({ queryKey: ["orders"] });
            navigate("/orders");
            return;
          }

          await finishOrder(result.orderId, result.orderNumber);
        },
      });
    } catch (error) {
      console.error(error);

      showSnackbar(
        error instanceof Error ? error.message : "Checkout failed.",
        "error",
      );

      setConfirming(false);
      setIsPlacingOrder(false);
    }
  };

  return (
    <PageShell>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.1rem" },
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: COLORS.text,
          }}
        >
          Checkout
        </Typography>

        <Stack
          direction="row"
          sx={{ mt: 0.5, alignItems: "center", flexWrap: "wrap", gap: 1.5 }}
        >
          <Typography
            sx={{ color: COLORS.muted, fontSize: { xs: "0.85rem", md: "0.95rem" } }}
          >
            Review your order and complete your purchase.
          </Typography>
          <Typography
            component={RouterLink}
            to="/cart"
            sx={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: COLORS.teal,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Back to cart
          </Typography>
        </Stack>
      </Box>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{ alignItems: "flex-start" }}
      >
        {/* Address, items and payment method */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
          <Stack spacing={{ xs: 2, md: 2.5 }}>
            <AddressSection
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
            />

            <CheckoutItems items={cartItems} />

            <PaymentSection
              paymentMethod={paymentMethod}
              onChange={setPaymentMethod}
            />
          </Stack>
        </Grid>

        {/* Order summary and place-order button */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ minWidth: 0 }}>
          <Stack
            spacing={2}
            sx={{
              position: { xs: "static", md: "sticky" },
              top: { md: 24 },
            }}
          >
            <CouponBox
              subtotal={subtotal}
              paymentMethod={paymentMethod}
              shipping={shipping}
              applied={coupon}
              onApply={setCoupon}
              onRemove={() => setCoupon(null)}
            />

            <CheckoutSummary
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              couponCode={coupon?.code}
              total={total}
              shippingNote={
                shipping > 0 && selectedAddress
                  ? `Delivery fee for about ${shippingQuote.billedKm} km`
                  : undefined
              }
            />

            <PlaceOrderButton
              onClick={handleCheckout}
              loading={
                isPlacingOrder ||
                confirming ||
                createCodOrderMutation.isPending
              }
              showPaymentIcons={paymentMethod !== "cod"}
              disabled={!selectedAddress || shippingLoading}
              disabledReason={
                addresses.length === 0
                  ? "Add a delivery address to continue."
                  : "Select a delivery address to continue."
              }
            />
            <SecurePaymentPartner />
          </Stack>
        </Grid>
      </Grid>

      {/* Shown only after the order is placed, while My Orders catches up. */}
      <Backdrop
        open={confirming}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
          color: COLORS.text,
          bgcolor: "rgba(255,255,255,0.94)",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: COLORS.blue }} />
        <Typography sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
          Confirming your order…
        </Typography>
        <Typography sx={{ color: COLORS.muted, fontSize: "0.875rem" }}>
          Please don't close or refresh this page.
        </Typography>
      </Backdrop>
    </PageShell>
  );
}