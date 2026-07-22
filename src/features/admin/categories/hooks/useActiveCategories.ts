import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../services/categoryService";

export function useActiveCategories() {
  return useQuery({
    queryKey: ["active-categories"],
    queryFn: () => getCategories(true),
  });
}