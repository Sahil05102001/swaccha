import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteAdminCoupon,
  getAdminCoupons,
  getAvailableCoupons,
  saveAdminCoupon,
} from "../services/couponService";

const AVAILABLE_KEY = ["coupons", "available"] as const;
const ADMIN_KEY = ["admin-coupons"] as const;

export function useAvailableCoupons(enabled = true) {
  return useQuery({
    queryKey: AVAILABLE_KEY,
    queryFn: getAvailableCoupons,
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ADMIN_KEY,
    queryFn: getAdminCoupons,
    retry: false,
  });
}

function useRefresh() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ADMIN_KEY }),
      queryClient.invalidateQueries({ queryKey: AVAILABLE_KEY }),
    ]);
}

export function useSaveCoupon() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (v: {
      coupon: Record<string, unknown> & { code: string };
      isNew: boolean;
    }) => saveAdminCoupon(v.coupon, v.isNew),
    onSuccess: refresh,
  });
}

export function useDeleteCoupon() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: deleteAdminCoupon,
    onSuccess: refresh,
  });
}