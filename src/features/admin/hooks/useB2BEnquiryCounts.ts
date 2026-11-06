
import { useQuery } from "@tanstack/react-query";

import { getB2BEnquiryCounts } from "../services/b2bAdminService";

export const B2B_ENQUIRY_COUNTS_QUERY_KEY = [
  "b2b-enquiry-counts",
];

export function useB2BEnquiryCounts() {
  return useQuery({
    queryKey: B2B_ENQUIRY_COUNTS_QUERY_KEY,
    queryFn: getB2BEnquiryCounts,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
