import ProductShelf from "@/components/ui/ProductShelf";

import { useProducts } from "@/features/products/hooks/useProducts";
import { useBestSellers } from "@/features/admin/bestsellers/hooks/useBestSellers";

export default function BestSellers() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: bestSellers = [], isLoading: bestSellersLoading } =
    useBestSellers();

  const bestSellerProducts = bestSellers
    .filter((item) => item.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => products.find((product) => product.id === item.productId))
    .filter(
      (product): product is NonNullable<typeof product> =>
        Boolean(product && product.isActive),
    );

  return (
    <ProductShelf
      title="Our Best Sellers"
      products={bestSellerProducts}
      badge="bestseller"
      isLoading={productsLoading || bestSellersLoading}
      background="#F5F7FA"
    />
  );
}