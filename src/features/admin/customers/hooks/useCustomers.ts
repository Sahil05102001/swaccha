import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getCustomerById,
  getCustomers,
  getCustomersPage,
  type Customer,
  type CustomersPage,
} from "../services/customerService";

export const CUSTOMERS_QUERY_KEY = ["customers"];

export function useCustomers() {
  return useQuery<Customer[]>({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: getCustomers,
  });
}

/** Pages of customers. The key starts with "customers", so existing invalidations still reach it. */
export function useCustomersPage(emailPrefix: string) {
  return useInfiniteQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, "page", emailPrefix],
    queryFn: ({ pageParam }) => getCustomersPage(pageParam, emailPrefix),
    initialPageParam: null as CustomersPage["last"],
    getNextPageParam: (page) => (page.hasMore ? page.last : undefined),
    staleTime: 60_000,
    retry: false,
  });
}

export function useCustomer(uid?: string) {
  return useQuery<Customer>({
    queryKey: ["customer", uid],
    queryFn: () => getCustomerById(uid!),
    enabled: Boolean(uid),
  });
}