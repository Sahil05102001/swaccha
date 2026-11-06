import { useCallback } from "react";

import loadRazorpay from "../utils/loadRazorpay";
import {
  createPaymentOrder,
  verifyPayment,
  type CheckoutItemInput,
  type CheckoutShippingAddress,
  type VerifyPaymentResponse,
} from "../services/paymentService";

interface RazorpayCheckoutOptions {
  items: CheckoutItemInput[];
  shippingAddress: CheckoutShippingAddress;
  customerName: string;
  customerEmail: string;
  customerContact: string;
  couponCode?: string;
  onSuccess: (result: VerifyPaymentResponse) => Promise<void>;
}

type RazorpayCheckoutInstance = {
  open: () => void;
  on: (
    event: string,
    handler: (response: {
      error?: { description?: string };
    }) => void,
  ) => void;
};

type RazorpayOptionsWithModal = ConstructorParameters<
  typeof window.Razorpay
>[0] & {
  modal?: {
    ondismiss?: () => void;
  };
};

export default function useRazorpayCheckout() {
  const payWithRazorpay = useCallback(
    async ({
      items,
      shippingAddress,
      customerName,
      customerEmail,
      customerContact,
      couponCode,
      onSuccess,
    }: RazorpayCheckoutOptions) => {
      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error("Unable to load Razorpay Checkout.");
      }

      const order = await createPaymentOrder({
        items,
        shippingAddress,
        ...(couponCode ? { couponCode } : {}),
      });

      await new Promise<void>((resolve, reject) => {
        let finished = false;
        let verificationStarted = false;
        let lastFailureMessage: string | null = null;

        const finishWithError = (error: Error) => {
          if (finished) return;
          finished = true;
          reject(error);
        };

        const checkoutOptions: RazorpayOptionsWithModal = {
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "Swachha",
          description: `Order ${order.orderNumber}`,
          order_id: order.orderId,
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerContact,
          },
          theme: {
            color: "#000000",
          },
          modal: {
            ondismiss: () => {
              // Once verification has started the payment is going through,
              // so a dismiss event must not turn it into an error.
              if (verificationStarted) return;

              finishWithError(
                new Error(lastFailureMessage ?? "Payment was cancelled."),
              );
            },
          },
          handler: async (response: RazorpayResponse) => {
            if (finished || verificationStarted) return;
            verificationStarted = true;

            try {
              const verification = await verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (!verification.success) {
                throw new Error(
                  verification.message || "Payment verification failed.",
                );
              }

              await onSuccess(verification);
              finished = true;
              resolve();
            } catch (error) {
              finishWithError(
                error instanceof Error
                  ? error
                  : new Error("Payment verification failed."),
              );
            }
          },
        };

        const checkout = new window.Razorpay(
          checkoutOptions as ConstructorParameters<
            typeof window.Razorpay
          >[0],
        ) as unknown as RazorpayCheckoutInstance;

        // A failed attempt does NOT end the flow: Razorpay keeps the popup
        // open so the customer can retry. Remember the reason and only show
        // it if they close the popup without paying.
        checkout.on("payment.failed", (response) => {
          lastFailureMessage =
            response.error?.description ||
            "Payment failed. Please try again.";
        });

        checkout.open();
      });
    },
    [],
  );

  return {
    payWithRazorpay,
  };
}