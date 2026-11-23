import { useMemo } from "react";

import { useProducts } from "../products/hooks/useProducts";
import { computeCategorySales } from "../services/dashboardCategorySalesService";
import { useSalesOrders } from "./useSalesOrders";

export function useSalesByCategory() {
  const orders = useSalesOrders();
  const products = useProducts();

  const data = useMemo(() => {
    if (!orders.data || !products.data) return undefined;

    const categoryOf = new Map(
      products.data.map((p) => [p.id, p.category] as const),
    );

    return computeCategorySales(orders.data, categoryOf);
  }, [orders.data, products.data]);

  return {
    data,
    isLoading: orders.isLoading || products.isLoading,
    isError: orders.isError || products.isError,
    error: orders.error ?? products.error,
  };
}