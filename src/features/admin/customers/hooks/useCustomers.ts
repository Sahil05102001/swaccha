import { useQuery } from "@tanstack/react-query";

import {
  getCustomerById,
  getCustomers,
  type Customer,
} from "../services/customerService";

export const CUSTOMERS_QUERY_KEY = ["customers"];

export function useCustomers() {
  return useQuery<Customer[]>({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: getCustomers,
  });
}

export function useCustomer(uid?: string) {
  return useQuery<Customer>({
    queryKey: ["customer", uid],
    queryFn: () => getCustomerById(uid!),
    enabled: Boolean(uid),
  });
}