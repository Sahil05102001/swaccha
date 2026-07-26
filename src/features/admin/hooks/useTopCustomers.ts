import { useQuery } from "@tanstack/react-query";

import { getTopCustomers } from "../services/dashboardTopCustomersService";

export const TOP_CUSTOMERS_QUERY_KEY = [
    "top-customers",
];

export function useTopCustomers() {
    return useQuery({
        queryKey: TOP_CUSTOMERS_QUERY_KEY,
        queryFn: getTopCustomers,
    });
}