import { computeTopSellingProducts } from "../services/dashboardTopProductsService";
import { useSalesOrders } from "./useSalesOrders";

export function useTopSellingProducts() {
  return useSalesOrders(computeTopSellingProducts);
}