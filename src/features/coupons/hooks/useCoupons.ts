import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "../services/couponService";

export function useCoupons() {
  const queryClient =
    useQueryClient();

  const coupons = useQuery({
    queryKey: ["coupons"],
    queryFn: getCoupons,
  });

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: ["coupons"],
    });

  const create =
    useMutation({
      mutationFn: createCoupon,
      onSuccess: refresh,
    });

  const update =
    useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: Parameters<
          typeof updateCoupon
        >[1];
      }) =>
        updateCoupon(id, data),

      onSuccess: refresh,
    });

  const remove =
    useMutation({
      mutationFn: deleteCoupon,
      onSuccess: refresh,
    });

  return {
    coupons: coupons.data ?? [],

    isLoading:
      coupons.isLoading,

    createCoupon:
      create.mutateAsync,

    updateCoupon:
      update.mutateAsync,

    deleteCoupon:
      remove.mutateAsync,
  };
}