import { useCallback } from "react";

import loadRazorpay from "../utils/loadRazorpay";
import {
  createPaymentOrder,
  verifyPayment,
} from "../services/paymentService";

interface RazorpayCheckoutOptions {
  amount: number;
  receipt: string;
  customerName: string;
  customerEmail: string;
  customerContact: string;
  onSuccess: (
    paymentId: string,
    orderId: string,
  ) => Promise<void>;
}

export default function useRazorpayCheckout() {
  const payWithRazorpay = useCallback(
    async ({
      amount,
      receipt,
      customerName,
      customerEmail,
      customerContact,
      onSuccess,
    }: RazorpayCheckoutOptions) => {
      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error(
          "Unable to load Razorpay Checkout.",
        );
      }

      const order =
        await createPaymentOrder({
          amount,
          receipt,
        });

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Swachha",
        description: "Order Payment",
        order_id: order.orderId,

        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerContact,
        },

        theme: {
          color: "#1976d2",
        },

        handler: async (
  response: RazorpayResponse,
) => {
          await verifyPayment({
            razorpayOrderId:
              response.razorpay_order_id,
            razorpayPaymentId:
              response.razorpay_payment_id,
            razorpaySignature:
              response.razorpay_signature,
          });

          await onSuccess(
            response.razorpay_payment_id,
            response.razorpay_order_id,
          );
        },
      });

      razorpay.open();
    },
    [],
  );

  return {
    payWithRazorpay,
  };
}