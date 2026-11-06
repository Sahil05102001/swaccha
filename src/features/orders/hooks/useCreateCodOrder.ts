
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createCodCheckoutOrder,
  type CodCheckoutItem,
  type CodShippingAddress,
} from "../services/checkoutService";

interface CreateCodCheckoutInput {
  items: CodCheckoutItem[];
  shippingAddress: CodShippingAddress;
  couponCode?: string;
}

export function useCreateCodOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCodCheckoutInput) =>
      createCodCheckoutOrder(input),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
      ]);
    },
  });
}
