import { computeTopCustomers } from "../services/dashboardTopCustomersService";
import { useSalesOrders } from "./useSalesOrders";

export function useTopCustomers() {
  return useSalesOrders(computeTopCustomers);
}